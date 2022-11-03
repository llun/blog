import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { DateTime } from 'luxon'
import { memoize } from 'lodash'

import { Config, getConfig, readAllLeafDirectories } from './blog'
import { getMarkdown } from './markdown'

interface AlbumProperties {
  title: string
  description: string
  image: string
  date: string
  token: string
}

interface Album {
  title: string
  description: string
  image: string
  card: string
  timestamp: number
  token: string
  content?: string
}

export const parseAlbum = (
  config: Config,
  file: string,
  includeContent = false
): Album | null => {
  try {
    const albumPath = path
      .dirname(file)
      .substring(path.join(process.cwd(), 'contents', 'galleries').length)
      .split(path.sep)
      .slice(1)

    fs.statSync(file)

    const raw = fs.readFileSync(file).toString('utf-8')
    const begin = raw.indexOf('---')
    const end = raw.indexOf('---', begin + 3)
    const { title, description, image, date, token } = yaml.parse(
      raw.substring(begin, end)
    ) as AlbumProperties
    const timestamp = DateTime.fromISO(date).toMillis()
    if (!includeContent) {
      return {
        title,
        description,
        image: `${image}.jpg`,
        card: `${image}.card.jpg`,
        timestamp,
        token
      }
    }

    const md = getMarkdown({
      rootURL: `${config.url}/gallery/${albumPath.join('/')}`
    })
    const content = md.render(raw.substring(end + 3).trim())
    return {
      title,
      description,
      image: `${image}.jpg`,
      card: `${image}.card.jpg`,
      timestamp,
      token,
      content
    }
  } catch {
    return null
  }
}

export const albumDescendingComparison = (album1: Album, album2: Album) => {
  if (album1.timestamp !== album2.timestamp)
    return album2.timestamp - album1.timestamp
  return album2.title.localeCompare(album1.title)
}

export const getAllAlbums = memoize(() => {
  const config = getConfig()
  const paths = readAllLeafDirectories(
    path.join(process.cwd(), 'contents', 'galleries')
  )
  const posts = paths
    .map((filePath) => parseAlbum(config, filePath, false))
    .filter((p): p is Album => p !== null)
  return posts
})
