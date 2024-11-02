import { AssetsRequest } from '../../app/api/apple/route'
import { Assets, Stream, VideoPosterDerivative } from './webstream'

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
  return stream.photos.map((photo) => {
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
}

export async function proxyAssetsUrl(
  partition: number,
  token: string,
  medias: Media[]
): Promise<Assets | null> {
  const url =
    process.env.NODE_ENV === 'production'
      ? 'https://next.llun.dev/api/apple/'
      : `http://${globalThis.location.host}/api/apple/`
  const body: AssetsRequest = {
    partition,
    token,
    photoGuids: medias.map((media) => media.guid)
  }
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: 'POST'
  })
  if (response.status !== 200) return null
  return response.json()
}

export function mergeMediaAssets(medias: Media[], assets: Assets) {
  for (const media of medias) {
    const values = Object.values(media.derivatives)
    for (const value of values) {
      const item = assets.items[value.checksum]
      const scheme = assets.locations[item.url_location].scheme
      const host = assets.locations[item.url_location].hosts[0]
      const prefix = `${scheme}://${host}`
      const url = `${prefix}${item.url_path}`
      value.url = url
    }
  }
}
