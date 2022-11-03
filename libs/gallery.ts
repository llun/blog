import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import { DateTime } from 'luxon'
import { memoize } from 'lodash'

import { Config, getConfig } from './blog'
import { getMarkdown } from './markdown'

interface AlbumProperties {
  title: string
  description: string
  image: string
  date: string
  token: string
}

export interface Album {
  name: string
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
    fs.statSync(file)
    const name = path.basename(file, '.md')
    const raw = fs.readFileSync(file).toString('utf-8')
    const begin = raw.indexOf('---')
    const end = raw.indexOf('---', begin + 3)
    const { title, description, image, date, token } = yaml.parse(
      raw.substring(begin, end)
    ) as AlbumProperties
    const timestamp = DateTime.fromISO(date).toMillis()
    if (!includeContent) {
      return {
        name,
        title,
        description,
        image: `${image}.jpg`,
        card: `${image}.card.jpg`,
        timestamp,
        token
      }
    }

    const md = getMarkdown({
      rootURL: `${config.url}/gallery`
    })
    const content = md.render(raw.substring(end + 3).trim())
    return {
      name,
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
  const base = path.join(process.cwd(), 'contents', 'galleries')
  const paths = fs.readdirSync(base).map((item) => path.join(base, item))
  const albums = paths
    .map((filePath) => parseAlbum(config, filePath, false))
    .filter((p): p is Album => p !== null)
  return albums
})
