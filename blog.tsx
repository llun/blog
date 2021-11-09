import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { DateTime } from 'luxon'
import memoize from 'lodash/memoize'

import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItFigures from 'markdown-it-implicit-figures'
import mila from 'markdown-it-link-attributes'

interface PostProperties {
  title: string
  lang: string
  description: string
  date: string
  image?: string
  tags?: string[]
}

interface PostFile {
  id: string
  name: string
  category: string | null
}

export interface Post {
  properties: PostProperties
  file: PostFile
  timestamp: number
  content?: string
}

export interface Config {
  title: string
  description: string
  url: string
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

export const getMarkdown = memoize(() => {
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
  return md
})

export const parsePost = memoize(
  (file: string, includeContent: boolean = false): Post => {
    try {
      fs.statSync(file)
      const md = getMarkdown()
      const raw = fs.readFileSync(file).toString('utf-8')
      const begin = raw.indexOf('---')
      const end = raw.indexOf('---', begin + 3)
      const properties: PostProperties = yaml.parse(raw.substring(begin, end))
      const timestamp = DateTime.fromISO(properties.date).toMillis()

      const postPath = path
        .dirname(file)
        .substring(path.join(process.cwd(), 'posts').length)
        .split(path.sep)
        .slice(1)

      if (!includeContent) {
        return {
          properties,
          file: {
            id: postPath.length > 1 ? postPath.join('/') : postPath[0],
            category: postPath.length > 1 ? postPath[0] : null,
            name: postPath[postPath.length - 1]
          },
          timestamp
        }
      }

      const content = md.render(raw.substring(end + 3).trim())
      return {
        properties,
        file: {
          id: postPath.length > 1 ? postPath.join('/') : postPath[0],
          category: postPath.length > 1 ? postPath[0] : null,
          name: postPath[postPath.length - 1]
        },
        content,
        timestamp
      }
    } catch (error) {
      return null
    }
  }
)

export const getAllPosts = memoize((): Post[] => {
  const paths = readAllLeafDirectories(path.join(process.cwd(), 'posts'))
  const posts = paths.map((filePath) =>
    parsePost(path.join(filePath, 'index.md'), false)
  )
  return posts
})

export const getConfig = memoize(
  (): Config => ({
    title: '@แนท',
    description: 'My notebook',
    url: 'https://www.llun.me'
  })
)
