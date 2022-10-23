import { AssetsRequest } from '../../pages/api/apple'
import { Stream, VideoPosterDerivative } from './webstream'

export interface Media {
  createdAt: number
  type: 'video' | 'photo'
  width: number
  height: number
  caption: string
  derivatives: {
    [key: string]: {
      checksum: string
      url?: string
    }
  }
  guid: string
}

export function getMediaList(stream: Stream): Media[] {
  return stream.photos
    .map((photo) => {
      if ('mediaAssetType' in photo) {
        const poster = photo.derivatives[VideoPosterDerivative]
        return {
          createdAt: new Date(photo.dateCreated).getTime(),
          type: 'video',
          width: poster.width,
          height: poster.height,
          caption: photo.caption,
          derivatives: Object.keys(photo.derivatives).reduce((out, item) => {
            out[item] = { checksum: photo.derivatives[item].checksum }
            return out
          }, {}),
          guid: photo.photoGuid
        } as Media
      }

      return {
        createdAt: new Date(photo.dateCreated).getTime(),
        type: 'photo',
        width: photo.width,
        height: photo.height,
        caption: photo.caption,
        derivatives: Object.keys(photo.derivatives).reduce((out, item) => {
          out[item] = { checksum: photo.derivatives[item].checksum }
          return out
        }, {}),
        guid: photo.photoGuid
      } as Media
    })
    .sort((first, second) => second.createdAt - first.createdAt)
}

export async function proxyAssetsUrl(streamId: string, medias: Media[]) {
  const url =
    process.env.NODE_ENV === 'production'
      ? 'https://next.llun.dev/api/apple'
      : 'http://localhost:3000/api/apple'
  const body: AssetsRequest = {
    streamId,
    photoGuids: medias.map((media) => media.guid)
  }
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: 'POST'
  })
  if (response.status !== 200) return null
  return response.json()
}

export function mergeMediaAssets(medias: Media[]) {}
