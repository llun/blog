import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItFigures from 'markdown-it-implicit-figures'
import mila from 'markdown-it-link-attributes'

export interface Post {
  properties: {
    title: string
    lang: string
    description: string
    date: string
    tags?: string[]
  }
  content: string
}

export function readAllLeafDirectories(root: string) {
  const posts = fs
    .readdirSync(root)
    .filter((name) => name !== '.DS_Store')
    .filter((name) => fs.statSync(path.join(root, name)).isDirectory())
  if (posts.length === 0) {
    return [root]
  }

  const paths = []
  for (const post of posts) {
    paths.push(...readAllLeafDirectories(path.join(root, post)))
  }

  return paths
}

export function parsePost(file: string): Post {
  try {
    fs.statSync(file)
    const raw = fs.readFileSync(file).toString('utf-8')
    const begin = raw.indexOf('---')
    const end = raw.indexOf('---', begin + 3)
    const properties = yaml.parse(raw.substring(begin, end))
    const content = raw.substring(end + 3).trim()
    return {
      properties,
      content
    }
  } catch (error) {
    return null
  }
}

export function getAllPosts(): Post[] {
  const md = markdownIt({
    html: true,
    breaks: true
  })
  md.use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#'
  })
  md.use(markdownItFigures, {
    figcaption: true
  })
  md.use(mila, {
    pattern: /^https:/,
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  })

  const paths = readAllLeafDirectories(path.join(process.cwd(), 'posts'))
  const posts = paths.map((filePath) =>
    parsePost(path.join(filePath, 'index.md'))
  )
  return posts
}
