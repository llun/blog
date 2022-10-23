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
let cache = null

/**
 * Fetch all media information from public iCloud Shared Album
 *
 * @param streamId shared album id, this is the string after hash e.g.
 *  https://www.icloud.com/sharedalbum/#B125ON9t3mbLNC id is B125ON9t3mbLNC
 */
export async function fetchStream(streamId: string): Promise<Stream | null> {
  if (cache) return cache
  const response = await fetch(
    `https://p64-sharedstreams.icloud.com/${streamId}/sharedstreams/webstream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ streamCtag: null })
    }
  )
  if (response.status !== 200) return null
  cache = await response.json()
  return cache
}

export async function fetchAssetsUrl(
  streamId: string,
  photoGuids: string[]
): Promise<Assets | null> {
  const response = await fetch(
    `https://p64-sharedstreams.icloud.com/${streamId}/sharedstreams/webasseturls`,
    {
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'text/plain',
        pragma: 'no-cache'
      },
      body: JSON.stringify({ photoGuids }),
      method: 'POST'
    }
  )
  if (response.status !== 200) return null
  return response.json()
}
