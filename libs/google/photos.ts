import type { Media } from '../apple/media'

/**
 * Google Photos shared albums (links like
 * https://photos.google.com/share/AF1Qip...?key=...) can be read without
 * signing in. Google has no API for them since 2025, so this reads the public
 * share page the way the page itself does:
 *
 * 1. The share page's `ds:1` data block holds the first 300 photos as
 *    `[id, [baseUrl, width, height, ...], createdAt, ...]`, then a page token.
 * 2. While there is a page token, the `snAcKc` batchexecute RPC returns the
 *    next page in the same shape.
 *
 * Base URLs don't expire and take a size suffix (`=w800-h800`), so the blog
 * links them directly and needs no proxy.
 *
 * The album token is the share path after `/share/`: `<albumId>?key=<key>`.
 */

const GooglePhotosTokenPattern = /^(AF1Qip[\w-]{20,})\?key=([\w-]{10,})$/
const ImageHost = 'https://lh3.googleusercontent.com/'
const ThumbnailSize = '=w800-h800'
const LargeSize = '=w2400-h2400'
const PageRpc = 'snAcKc'
const MaxPages = 50
const Headers = { 'User-Agent': 'Mozilla/5.0' }

export const isGooglePhotosToken = (token: unknown): token is string =>
  typeof token === 'string' && GooglePhotosTokenPattern.test(token)

type Item = [
  string,
  [string, number, number, ...unknown[]],
  number,
  ...unknown[]
]

interface Page {
  medias: Media[]
  next: string | null
}

const toPage = (data: unknown): Page | null => {
  if (!Array.isArray(data) || !Array.isArray(data[1])) return null
  const medias: Media[] = (data[1] as Item[])
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
  const next = typeof data[2] === 'string' && data[2] ? data[2] : null
  return { medias, next }
}

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** The first page, from the share page's `ds:1` data block. */
export const parseSharePage = (html: string): Page | null => {
  const match = html.match(
    /AF_initDataCallback\(\{key: 'ds:1'[^]*?data:([^]*?), sideChannel: \{\}\}\);<\/script>/
  )
  return match ? toPage(parseJson(match[1])) : null
}

/** A later page, from a batchexecute response (one JSON chunk per line). */
export const parseRpcResponse = (text: string): Page | null => {
  for (const line of text.split('\n')) {
    if (!line.startsWith('[["wrb.fr"')) continue
    const envelope = parseJson(line)
    const payload =
      Array.isArray(envelope) && Array.isArray(envelope[0])
        ? envelope[0][2]
        : null
    if (typeof payload === 'string') return toPage(parseJson(payload))
  }
  return null
}

const fetchNextPage = async (albumId: string, key: string, token: string) => {
  const request = JSON.stringify([albumId, token, null, key])
  const response = await fetch(
    `https://photos.google.com/_/PhotosUi/data/batchexecute?rpcids=${PageRpc}&rt=c`,
    {
      method: 'POST',
      headers: {
        ...Headers,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams({
        'f.req': JSON.stringify([[[PageRpc, request, null, 'generic']]])
      })
    }
  )
  if (response.status !== 200) {
    console.warn(`Google Photos page returned ${response.status}`)
    return null
  }
  return parseRpcResponse(await response.text())
}

export async function fetchGooglePhotosAlbum(
  token: string
): Promise<Media[] | null> {
  const match = GooglePhotosTokenPattern.exec(token)
  if (!match) return null
  const [, albumId, key] = match
  try {
    const response = await fetch(`https://photos.google.com/share/${token}`, {
      headers: Headers
    })
    if (response.status !== 200) {
      console.warn(`Google Photos album returned ${response.status}`)
      return null
    }
    let page = parseSharePage(await response.text())
    if (!page) return null

    const medias = [...page.medias]
    for (let count = 1; page.next && count < MaxPages; count++) {
      page = await fetchNextPage(albumId, key, page.next)
      if (!page) break
      medias.push(...page.medias)
    }
    return medias
  } catch (error) {
    console.warn('Failed to load Google Photos album', error)
    return null
  }
}
