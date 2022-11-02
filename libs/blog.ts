import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { DateTime } from 'luxon'
import memoize from 'lodash/memoize'
import { Feed } from 'feed'

import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItFigures from 'markdown-it-implicit-figures'
import mila from 'markdown-it-link-attributes'

import markdownItAbsolutePath, {
  AbsolutePathConfig
} from './markdownItAbsolutePath'

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

  const paths: string[] = []
  for (const post of posts) {
    paths.push(...readAllLeafDirectories(path.join(root, post)))
  }

  return paths
}

export const getMarkdown = (config: AbsolutePathConfig) => {
  const md = markdownIt({
    html: true,
    linkify: true
  })
  md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.linkInsideHeader({ space: true })
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
  md.use(markdownItAbsolutePath, config)
  return md
}

export const parsePost = (
  config: Config,
  file: string,
  includeContent = false
): Post | null => {
  try {
    const postPath = path
      .dirname(file)
      .substring(path.join(process.cwd(), 'contents', 'posts').length)
      .split(path.sep)
      .slice(1)

    fs.statSync(file)
    const md = getMarkdown({
      rootURL: `${config.url}/posts/${postPath.join('/')}`
    })
    const raw = fs.readFileSync(file).toString('utf-8')
    const begin = raw.indexOf('---')
    const end = raw.indexOf('---', begin + 3)
    const properties: PostProperties = yaml.parse(raw.substring(begin, end))
    const timestamp = DateTime.fromISO(properties.date).toMillis()

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

export const postDescendingComparison = (post1: Post, post2: Post) => {
  if (post1.timestamp !== post2.timestamp)
    return post2.timestamp - post1.timestamp
  return post2.properties.title.localeCompare(post1.properties.title)
}

export const getAllPosts = memoize((): Post[] => {
  const config = getConfig()
  const paths = readAllLeafDirectories(
    path.join(process.cwd(), 'contents', 'posts')
  )
  const posts = paths
    .map((filePath) =>
      parsePost(config, path.join(filePath, 'index.md'), false)
    )
    .filter((p): p is Post => p !== null)
  return posts
})

export const generateFeeds = memoize((config: Config, sortedPosts: Post[]) => {
  const feed = new Feed({
    title: config.title,
    description: config.description,
    link: config.url,
    id: config.url,
    language: 'th',
    copyright: 'All rights reserved 2022, Maythee Anegboonlap',
    generator: '@llun',
    image: `${config.url}/img/apple-touch-icon.png`,
    favicon: `${config.url}/img/favicon-32x32.png`,
    author: {
      name: 'Maythee Anegboonlap',
      email: 'contact@llun.dev',
      link: config.url
    },
    feedLinks: {
      rss2: `${config.url}/feeds/feed.xml`,
      json: `${config.url}/feeds/feed.json`,
      atom: `${config.url}/feeds/atom.xml`
    }
  })
  const firstFewPosts = sortedPosts.slice(0, 5)
  for (const post of firstFewPosts) {
    const contentPath = path.join(
      process.cwd(),
      'contents',
      'posts',
      post.file.id,
      'index.md'
    )
    const postWithContent = parsePost(config, contentPath, true)
    if (!postWithContent) continue

    const { properties, file, timestamp, content } = postWithContent
    feed.addItem({
      title: `${properties.title}`,
      id: `${config.url}/posts/${file.id}`,
      link: `${config.url}/posts/${file.id}`,
      description: properties.description,
      date: DateTime.fromMillis(timestamp).toJSDate(),
      image:
        properties.image &&
        `${config.url}/posts/${file.id}/${properties.image}`,
      content
    })
  }
  const feedsPath = path.join(process.cwd(), 'public', 'feeds')
  fs.mkdirSync(feedsPath, { recursive: true })
  fs.writeFileSync(path.join(feedsPath, 'rss.xml'), feed.rss2())
  fs.writeFileSync(path.join(feedsPath, 'atom.xml'), feed.atom1())
  fs.writeFileSync(path.join(feedsPath, 'main'), feed.atom1())
  fs.writeFileSync(path.join(feedsPath, 'feed.json'), feed.json1())
})

export const getConfig = memoize(
  (): Config => ({
    title: '@แนท',
    description: 'Life, Ride and Code',
    url: process.env.NEXT_PUBLIC_DOMAIN || 'https://www.llun.me'
  })
)
