import { Media, WebStream } from './types'

/**
 * Fetch all media information from public iCloud Shared Album
 *
 * @param streamId shared album id, this is the string after hash e.g.
 *  https://www.icloud.com/sharedalbum/#B125ON9t3mbLNC id is B125ON9t3mbLNC
 */
export async function fetchStream(
  streamId: string
): Promise<WebStream.Stream | null> {
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
  return response.json()
}

export function getMediaList(stream: WebStream.Stream): Media[] {
  return stream.photos.map((photo) => {
    if ('mediaAssetType' in photo) {
      const poster = photo.derivatives[WebStream.VideoPosterDerivative]
      return {
        createdAt: new Date(photo.dateCreated),
        type: 'video',
        width: poster.width,
        height: poster.height,
        caption: photo.caption,
        derivatives: Object.keys(photo.derivatives),
        guid: photo.photoGuid
      }
    }

    return {
      createdAt: new Date(photo.dateCreated),
      type: 'photo',
      width: photo.width,
      height: photo.height,
      caption: photo.caption,
      derivatives: Object.keys(photo.derivatives),
      guid: photo.photoGuid
    }
  })
}
