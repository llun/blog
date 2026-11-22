#!/usr/bin/env node
// Tells IndexNow (Bing, Yandex, Seznam, Naver ...) which pages changed in a
// deploy: URLs that are new in the sitemap or whose <lastmod> moved since the
// sitemap that was live before the deploy. The key is the public /<key>.txt
// file (public/, exported next to the sitemap), which is how IndexNow checks
// we own the host.
//
// Usage: node scripts/indexnow.mjs <new sitemap.xml> [previous sitemap.xml]
//        [--dry-run]
// Without a previous sitemap every URL is submitted.
import fs from 'node:fs'
import path from 'node:path'

const ENDPOINT = 'https://api.indexnow.org/indexnow'
// IndexNow accepts at most 10,000 URLs per request
const BATCH_SIZE = 10000

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const [newSitemap, previousSitemap] = args.filter(
  (arg) => !arg.startsWith('--')
)
if (!newSitemap) {
  console.error(
    'Usage: node scripts/indexnow.mjs <sitemap.xml> [previous.xml] [--dry-run]'
  )
  process.exit(1)
}

const readEntries = (file) => {
  if (!file || !fs.existsSync(file)) return null
  const xml = fs.readFileSync(file, 'utf8')
  const entries = new Map()
  for (const [, body] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(body)?.[1]?.trim()
    if (!loc) continue
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(body)?.[1]?.trim() ?? ''
    entries.set(loc, lastmod)
  }
  return entries
}

// The key file sits next to the exported sitemap, or in public/ locally
const findKey = () => {
  const dirs = [path.dirname(path.resolve(newSitemap)), 'public']
  const publicDir = dirs.find(
    (dir) =>
      fs.existsSync(dir) &&
      fs.readdirSync(dir).some((name) => /^[a-f0-9]{32}\.txt$/.test(name))
  )
  const keyFile = publicDir
    ? fs.readdirSync(publicDir).find((name) => /^[a-f0-9]{32}\.txt$/.test(name))
    : undefined
  if (!publicDir || !keyFile) {
    throw new Error('No IndexNow key file (public/<key>.txt)')
  }
  const key = path.basename(keyFile, '.txt')
  const content = fs.readFileSync(path.join(publicDir, keyFile), 'utf8').trim()
  if (content !== key) throw new Error(`${keyFile} must contain ${key}`)
  return key
}

const current = readEntries(newSitemap)
if (!current) {
  console.error(`indexnow: ${newSitemap} not found`)
  process.exit(1)
}
const previous = readEntries(previousSitemap)
const changed = [...current.entries()]
  .filter(([loc, lastmod]) => !previous || previous.get(loc) !== lastmod)
  .map(([loc]) => loc)

if (changed.length === 0) {
  console.log('indexnow: no changed URLs')
  process.exit(0)
}

const key = findKey()
const origin = new URL(changed[0]).origin
const host = new URL(origin).host
console.log(
  `indexnow: ${changed.length} changed URL(s)${previous ? '' : ' (no previous sitemap, sending all)'}`
)
for (const url of changed.slice(0, 20)) console.log(`  ${url}`)
if (changed.length > 20) console.log(`  ... and ${changed.length - 20} more`)
if (dryRun) process.exit(0)

for (let start = 0; start < changed.length; start += BATCH_SIZE) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${origin}/${key}.txt`,
      urlList: changed.slice(start, start + BATCH_SIZE)
    })
  })
  // 200 and 202 are both accepted; anything else is reported but does not
  // fail the deploy, which has already gone out
  console.log(`indexnow: ${response.status} ${response.statusText}`)
  if (response.status >= 400) {
    console.log(await response.text())
  }
}
