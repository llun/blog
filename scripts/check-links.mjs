#!/usr/bin/env node
// Fails the export when a page in out/ links to an internal URL that the
// static site cannot serve (it would 404 on S3), or links to a page without
// the trailing slash (S3 answers those with a redirect instead of the page).
//
// Usage: node scripts/check-links.mjs [outDir]
import fs from 'node:fs'
import path from 'node:path'

const outDir = path.resolve(process.argv[2] ?? 'out')
const SITE_ORIGINS = ['https://www.llun.me', 'https://llun.me']

// Paths that exist in production but are not part of the export
const ALLOWED_PREFIXES = [
  // Mastodon/webfinger style paths are served by other hosts
  '/.well-known/'
]

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const ATTRIBUTE = /\s(href|src|srcset|poster)\s*=\s*("([^"]*)"|'([^']*)')/gi

const extractUrls = (html) => {
  // Script bodies (JSON-LD, RSC payloads) hold URLs that are not links
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, '')
  const urls = []
  for (const tag of markup.match(
    /<(a|img|source|link|video|audio)\b[^>]*>/gi
  ) ?? []) {
    // rel=alternate/preconnect/dns-prefetch links can point anywhere
    if (/^<link\b/i.test(tag) && /rel="(preconnect|dns-prefetch)"/i.test(tag))
      continue
    for (const match of tag.matchAll(ATTRIBUTE)) {
      const name = match[1].toLowerCase()
      const value = decodeEntities(match[3] ?? match[4] ?? '').trim()
      if (!value) continue
      if (name === 'srcset') {
        for (const candidate of value.split(',')) {
          const url = candidate.trim().split(/\s+/)[0]
          if (url) urls.push({ url, isPageLink: false })
        }
      } else {
        urls.push({ url: value, isPageLink: /^<a\b/i.test(tag) })
      }
    }
  }
  return urls
}

// Turns a link found on `page` into a path inside out/, or null when the link
// leaves the site
const toSitePath = (url, page) => {
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(url)) return null
  let resolved
  try {
    const pageUrl = new URL(
      '/' + path.relative(outDir, page).split(path.sep).join('/'),
      SITE_ORIGINS[0]
    )
    resolved = new URL(url, pageUrl)
  } catch {
    return { invalid: true }
  }
  if (!SITE_ORIGINS.includes(resolved.origin)) {
    // A bare domain such as "cursor.com" resolves under our own origin
    return null
  }
  return { pathname: decodeURIComponent(resolved.pathname) }
}

const exists = (pathname) => {
  const target = path.join(outDir, pathname)
  if (!target.startsWith(outDir)) return false
  if (pathname.endsWith('/')) {
    return fs.existsSync(path.join(target, 'index.html'))
  }
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return true
  // Next writes pages as <path>/index.html; S3 serves them for <path>/
  return fs.existsSync(path.join(target, 'index.html'))
}

const isPage = (pathname) =>
  !pathname.endsWith('/') &&
  fs.existsSync(path.join(outDir, pathname, 'index.html'))

if (!fs.existsSync(outDir)) {
  console.error(`check-links: ${outDir} does not exist, run the export first`)
  process.exit(1)
}

const pages = walk(outDir).filter((file) => file.endsWith('.html'))
const problems = []
let checked = 0
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8')
  const pageName = '/' + path.relative(outDir, page).split(path.sep).join('/')
  for (const { url, isPageLink } of extractUrls(html)) {
    const target = toSitePath(url, page)
    if (!target) continue
    checked++
    if (target.invalid) {
      problems.push(`${pageName}: invalid URL ${url}`)
      continue
    }
    const { pathname } = target
    if (ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) continue
    if (!exists(pathname)) {
      problems.push(`${pageName}: broken link ${url}`)
    } else if (isPageLink && isPage(pathname)) {
      problems.push(
        `${pageName}: ${url} is missing its trailing slash (redirects)`
      )
    }
  }
}

if (problems.length > 0) {
  console.error(`check-links: ${problems.length} problem(s) found`)
  for (const problem of [...new Set(problems)]) console.error(`  ${problem}`)
  process.exit(1)
}
console.log(
  `check-links: ${checked} internal links in ${pages.length} pages are fine`
)
