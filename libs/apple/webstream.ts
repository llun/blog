interface Derivative {
  fileSize: number
  checksum: string
  width: number
  height: number
  state?: string
}

interface Media {
  batchGuid: string
  derivatives: {
    [key: string]: Derivative
  }
  contributorLastName: string
  batchDateCreated: string
  dateCreated: string
  contributorFirstName: string
  photoGuid: string
  contributorFullName: string
  caption: string
}

interface Image extends Media {
  width: number
  height: number
}

interface Video extends Media {
  mediaAssetType: 'video'
}

type Photo = Video | Image

export interface Stream {
  userLastName: string
  streamCtag: string
  itemsReturned: number
  userFirstName: string
  streamName: string
  photos: Photo[]
  partition: number
}

export interface Assets {
  items: {
    [checksum: string]: {
      url_expiry: string
      url_location: string
      url_path: string
    }
  }
  locations: {
    [host: string]: {
      hosts: string[]
      scheme: string
    }
  }
}

export const VideoPosterDerivative = 'PosterFrame'
export const Video720p = '720p'
export const Video360p = '360p'

const PhotoAppUserAgent =
  'Photos/5.0 (Macintosh; OS X 10.15.4) AppleWebKit/605.1.15'
const Base62Charset =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const base62ToInt = (input: string) =>
  Array.from(input).reduce(
    (result, char) => result * 62 + Base62Charset.indexOf(char),
    0
  )

function getPartitionFromToken(token: string) {
  const serverPartition =
    token[0] === 'A'
      ? base62ToInt(token[1])
      : base62ToInt(token.substring(1, 3))
  if (serverPartition < 10) return `0${serverPartition}`
  return serverPartition
}

function getStreamBaseUrl(token: string) {
  const partition = getPartitionFromToken(token)
  return `https://p${partition}-sharedstreams.icloud.com`
}

/**
 * Apple moves shared albums between servers. The old server then answers
 * with HTTP 330 and a body naming the new one, e.g.
 * { "X-Apple-MMe-Host": "p140-sharedstreams.icloud.com" }
 */
const SharedStreamsHost = /^p(\d+)-sharedstreams\.icloud\.com$/

async function getRedirectHost(response: Response): Promise<string | null> {
  try {
    const data = (await response.json()) as { 'X-Apple-MMe-Host'?: unknown }
    const host = data['X-Apple-MMe-Host']
    if (typeof host !== 'string' || !SharedStreamsHost.test(host)) return null
    return host
  } catch {
    return null
  }
}

function getPartitionFromHost(host: string) {
  return parseInt(SharedStreamsHost.exec(host)?.[1] ?? '0', 10)
}

/**
 * Fetch all media information from public iCloud Shared Album
 *
 * @param token shared album id, this is the string after hash e.g.
 *  https://www.icloud.com/sharedalbum/#B125ON9t3mbLNC id is B125ON9t3mbLNC
 */
export async function fetchStream(token: string): Promise<Stream | null> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      'User-Agent': PhotoAppUserAgent
    },
    body: JSON.stringify({ streamCtag: null })
  }
  const response = await fetch(
    `${getStreamBaseUrl(token)}/${token}/sharedstreams/webstream`,
    requestOptions
  )
  if (response.status === 330) {
    const host = await getRedirectHost(response)
    if (!host) return null
    const redirectResponse = await fetch(
      `https://${host}/${token}/sharedstreams/webstream`,
      requestOptions
    )
    if (redirectResponse.status !== 200) return null

    return {
      ...(await redirectResponse.json()),
      partition: getPartitionFromHost(host)
    }
  }
  if (response.status !== 200) return null
  return { ...(await response.json()), partition: getPartitionFromToken(token) }
}

export async function fetchAssetsUrl(
  partition: number,
  token: string,
  photoGuids: string[]
): Promise<Response | null> {
  const requestOptions = {
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'text/plain',
      pragma: 'no-cache'
    },
    body: JSON.stringify({ photoGuids }),
    method: 'POST'
  }
  const response = await fetch(
    `https://p${partition}-sharedstreams.icloud.com/${token}/sharedstreams/webasseturls`,
    requestOptions
  )
  // Pages built before Apple moved the album still send the old partition
  if (response.status === 330) {
    const host = await getRedirectHost(response)
    if (!host) return null
    const redirectResponse = await fetch(
      `https://${host}/${token}/sharedstreams/webasseturls`,
      requestOptions
    )
    if (redirectResponse.status !== 200) return null
    return redirectResponse
  }
  if (response.status !== 200) return null
  return response
}
