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

const Base62Charset =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const base62ToInt = (input: string) =>
  Array.from(input).reduce(
    (result, char) => result * 62 + Base62Charset.indexOf(char),
    0
  )

function getPartitionFromStreamId(streamId: string) {
  const serverPartition =
    streamId[0] === 'A'
      ? base62ToInt(streamId[1])
      : base62ToInt(streamId.substring(1, 3))
  if (serverPartition < 10) return `0${serverPartition}`
  return serverPartition
}

function getStreamBaseUrl(streamId: string) {
  const partition = getPartitionFromStreamId(streamId)
  return `https://p${partition}-sharedstreams.icloud.com`
}

/**
 * Fetch all media information from public iCloud Shared Album
 *
 * @param streamId shared album id, this is the string after hash e.g.
 *  https://www.icloud.com/sharedalbum/#B125ON9t3mbLNC id is B125ON9t3mbLNC
 */
export async function fetchStream(streamId: string): Promise<Stream | null> {
  const response = await fetch(
    `${getStreamBaseUrl(streamId)}/${streamId}/sharedstreams/webstream`,
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
  return response.json()
}

export async function fetchAssetsUrl(
  streamId: string,
  photoGuids: string[]
): Promise<Assets | null> {
  const response = await fetch(
    `${getStreamBaseUrl(streamId)}/${streamId}/sharedstreams/webasseturls`,
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
