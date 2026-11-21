#!/usr/bin/env node
// Prints every exported page directory in out/ without its trailing slash,
// one per line (e.g. posts/dev/2015-01-01-Ember.js). The deploy puts an empty
// S3 object with a website redirect at each of these keys, so the S3 website
// endpoint answers /posts/x with a 301 to /posts/x/ instead of its own 302.
//
// Usage: node scripts/list-page-dirs.mjs [outDir]
import fs from 'node:fs'
import path from 'node:path'

const outDir = path.resolve(process.argv[2] ?? 'out')

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return []
    const full = path.join(dir, entry.name)
    return [full, ...walk(full)]
  })

for (const dir of walk(outDir)) {
  if (!fs.existsSync(path.join(dir, 'index.html'))) continue
  const key = path.relative(outDir, dir).split(path.sep).join('/')
  // Next's own folders are not pages people link to
  if (key.startsWith('_') || key === '404') continue
  console.log(key)
}
