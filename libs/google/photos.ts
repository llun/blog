import type { Media } from '../apple/media'

/**
 * Google Photos shared albums (links like
 * https://photos.google.com/share/AF1Qip...?key=...) can be read without
 * signing in. Google has no API for them since 2025, so this reads the public
 * share page: its `ds:1` data block lists every photo as
 * `[id, [baseUrl, width, height, ...], createdAt, ...]`.
 *
 * Base URLs don't expire and take a size suffix (`=w800-h800`), so the blog
 * links them directly and needs no proxy.
 *
 * The album token is the share path after `/share/`: `<albumId>?key=<key>`.
 */

const GooglePhotosTokenPattern = /^AF1Qip[\w-]{20,}\?key=[\w-]{10,}$/
const ImageHost = 'https://lh3.googleusercontent.com/'
const ThumbnailSize = '=w800-h800'
const LargeSize = '=w2400-h2400'

export const isGooglePhotosToken = (token: unknown): token is string =>
  typeof token === 'string' && GooglePhotosTokenPattern.test(token)

type Item = [
  string,
  [string, number, number, ...unknown[]],
  number,
  ...unknown[]
]

export const parseSharePage = (html: string): Media[] | null => {
  const match = html.match(
    /AF_initDataCallback\(\{key: 'ds:1'[^]*?data:([^]*?), sideChannel: \{\}\}\);<\/script>/
  )
  if (!match) return null

  let data: unknown
  try {
    data = JSON.parse(match[1])
  } catch {
    return null
  }
  if (!Array.isArray(data) || !Array.isArray(data[1])) return null
  // shortcut: only the first page is read; Google pages albums of several
  // hundred photos, and loading the rest needs its batchexecute RPC
  if (data[2]) {
    console.warn('Google Photos album has more photos than its first page')
  }

  return (data[1] as Item[])
    .filter(
      (item) =>
        Array.isArray(item?.[1]) &&
        typeof item[1][0] === 'string' &&
        item[1][0].startsWith(ImageHost)
    )
    .map(([id, [url, width, height], createdAt]) => ({
      createdAt,
      type: 'photo',
      width,
      height,
      caption: '',
      derivatives: {
        thumbnail: {
          checksum: `${id}-thumbnail`,
          url: `${url}${ThumbnailSize}`
        },
        large: { checksum: `${id}-large`, url: `${url}${LargeSize}` }
      },
      guid: id
    }))
}

export async function fetchGooglePhotosAlbum(
  token: string
): Promise<Media[] | null> {
  if (!isGooglePhotosToken(token)) return null
  try {
    const response = await fetch(`https://photos.google.com/share/${token}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    if (response.status !== 200) {
      console.warn(`Google Photos album returned ${response.status}`)
      return null
    }
    return parseSharePage(await response.text())
  } catch (error) {
    console.warn('Failed to load Google Photos album', error)
    return null
  }
}
