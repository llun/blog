import React, { FC, useEffect, useRef, useState } from 'react'
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
  const photoDom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      const first = medias.slice(0, BatchSize)
      const assets = await proxyAssetsUrl(token, first)
      if (!assets) return

      mergeMediaAssets(first, assets)
      setPhotos(first)
    })()
  }, [token, medias])

  useEffect(() => {
    if (!photoDom.current) return

    const intersectionObserver = new IntersectionObserver((entries) => {
      console.log(entries)
    })
    intersectionObserver.observe(photoDom.current)
    return () => intersectionObserver.disconnect()
  }, [photos])

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

        const key =
          media.type === 'video'
            ? VideoPosterDerivative
            : Object.keys(media.derivatives).sort(
                (second, first) => parseInt(first, 10) - parseInt(second, 10)
              )[0]
        const backgroundImage = `url(${media.derivatives[key].url})`

        return (
          <div
            key={media.guid}
            className={cn(style.image, {
              [directionClass]: shouldExpand,
              [style['super-square']]: shouldBeBig
            })}
            style={{ backgroundImage }}
          />
        )
      })}
    </div>
  )
}

export default RideMedias
