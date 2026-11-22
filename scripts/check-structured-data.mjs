#!/usr/bin/env node
// Checks the JSON-LD on every exported page: it must parse, use the
// schema.org context, carry a BreadcrumbList, and give each page type the
// node it needs (BlogPosting on posts, WebSite and Person on the home page,
// CollectionPage or ImageGallery on lists and albums). Property names and
// value types are checked at type-check time through schema-dts
// (libs/structuredData.ts).
//
// Usage: node scripts/check-structured-data.mjs [outDir]
import fs from 'node:fs'
import path from 'node:path'

const outDir = path.resolve(process.argv[2] ?? 'out')

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })

const REQUIRED = {
  BlogPosting: [
    'headline',
    'description',
    'datePublished',
    'dateModified',
    'author',
    'image',
    'mainEntityOfPage',
    'keywords',
    'inLanguage'
  ],
  Person: ['name', 'url', 'image', 'sameAs'],
  WebSite: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
  CollectionPage: ['name', 'description', 'url'],
  ImageGallery: ['name', 'description', 'url']
}

const expectedTypes = (pagePath) => {
  if (pagePath === '/') return ['WebSite', 'Person']
  if (/^\/posts\/.+/.test(pagePath)) return ['BlogPosting']
  return [['CollectionPage', 'ImageGallery']]
}

const problems = []
const pages = walk(outDir).filter(
  (file) =>
    file.endsWith('index.html') &&
    !file.includes(`${path.sep}_not-found${path.sep}`) &&
    !file.includes(`${path.sep}404${path.sep}`)
)
for (const file of pages) {
  const pagePath =
    '/' +
    path
      .relative(outDir, path.dirname(file))
      .split(path.sep)
      .filter(Boolean)
      .join('/')
  const html = fs.readFileSync(file, 'utf8')
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )
  ].map((match) => match[1])
  if (blocks.length === 0) {
    problems.push(`${pagePath}: no JSON-LD`)
    continue
  }
  const nodes = []
  for (const block of blocks) {
    try {
      const data = JSON.parse(block)
      if (data['@context'] !== 'https://schema.org') {
        problems.push(`${pagePath}: @context is not https://schema.org`)
      }
      nodes.push(...(data['@graph'] ?? [data]))
    } catch (error) {
      problems.push(`${pagePath}: JSON-LD does not parse (${error.message})`)
    }
  }
  const types = new Set(nodes.map((node) => node['@type']))
  for (const expected of ['BreadcrumbList', ...expectedTypes(pagePath)]) {
    const options = Array.isArray(expected) ? expected : [expected]
    if (!options.some((type) => types.has(type))) {
      problems.push(`${pagePath}: no ${options.join(' or ')}`)
    }
  }
  for (const node of nodes) {
    for (const property of REQUIRED[node['@type']] ?? []) {
      const value = node[property]
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0 && property !== 'keywords')
      ) {
        problems.push(`${pagePath}: ${node['@type']} has no ${property}`)
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`check-structured-data: ${problems.length} problem(s) found`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
console.log(`check-structured-data: JSON-LD on ${pages.length} pages is fine`)
