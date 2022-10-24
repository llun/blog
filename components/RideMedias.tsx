import React, { FC, useEffect, useState } from 'react'
import cn from 'classnames'
import { Media, mergeMediaAssets, proxyAssetsUrl } from '../libs/apple/media'
import { VideoPosterDerivative } from '../libs/apple/webstream'

import style from './RideMedias.module.css'

const BatchSize = 24

const RideMedias: FC<{ token: string; medias: Media[] }> = ({
  token,
  medias
}) => {
  const [photos, setPhotos] = useState<Media[]>([])

  useEffect(() => {
    ;(async () => {
      const first = medias.slice(0, BatchSize)
      const assets = await proxyAssetsUrl(token, first)
      if (!assets) return

      mergeMediaAssets(first, assets)
      setPhotos(first)
    })()
  }, [token, medias])

  if (!photos.length) return null

  return (
    <div className={style.images}>
      {photos.map((media) => {
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
