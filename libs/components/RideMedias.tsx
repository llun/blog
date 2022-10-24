import React, { FC, useEffect, useState } from 'react'
import cn from 'classnames'
import { Media, mergeMediaAssets, proxyAssetsUrl } from '../apple/media'
import { VideoPosterDerivative } from '../apple/webstream'

import style from './RideMedias.module.css'

const RideMedias: FC<{ token: string; medias: Media[] }> = ({
  token,
  medias
}) => {
  const [photos, setPhotos] = useState<Media[]>([])

  useEffect(() => {
    ;(async () => {
      const assets = await proxyAssetsUrl(token, medias)
      if (!assets) return

      mergeMediaAssets(medias, assets)
      setPhotos(medias)
    })()
  }, [token, medias])

  if (!photos.length) return null

  return (
    <div className={style.images}>
      {photos.map((media, index) => {
        const directionClass =
          media.width > media.height
            ? style.wide
            : media.width < media.height
            ? style.tall
            : ''

        const random = Math.ceil(Math.random() * 1000)

        const shouldBeBig = random % 11 === 0
        const shouldExpand = random % 7 === 0 && !shouldBeBig

        if (media.type === 'video') {
          return (
            <div
              key={media.guid}
              className={cn(style.image, {
                [directionClass]: shouldExpand,
                [style['super-square']]: shouldBeBig
              })}
              style={{
                backgroundImage: `url(${media.derivatives[VideoPosterDerivative].url})`
              }}
            />
          )
        }

        const keys = Object.keys(media.derivatives).sort(
          (second, first) => parseInt(first, 10) - parseInt(second, 10)
        )

        return (
          <div
            key={media.guid}
            className={cn(style.image, {
              [directionClass]: shouldExpand,
              [style['super-square']]: shouldBeBig
            })}
            style={{
              backgroundImage: `url(${media.derivatives[keys[0]].url})`
            }}
          />
        )
      })}
    </div>
  )
}

export default RideMedias
