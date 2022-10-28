import React, { FC, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Media, mergeMediaAssets, proxyAssetsUrl } from '../libs/apple/media'
import { VideoPosterDerivative } from '../libs/apple/webstream'

import style from './RideMedias.module.css'
import MediaModal from './MediaModal'

type PhotoState = 'loading' | 'idle'

const BatchSize = 24

function canLoadPhoto(
  allMedias: Media[],
  currentMedias: Media[],
  state: PhotoState
) {
  if (currentMedias.length === allMedias.length) return false
  if (state === 'loading') return false
  return true
}

const RideMedias: FC<{ token: string; medias: Media[] }> = ({
  token,
  medias
}) => {
  const [photoState, setPhotoState] = useState<PhotoState>('idle')
  const [photos, setPhotos] = useState<Media[]>([])
  const [selectedMedia, setSelectedMedia] = useState<Media>()
  const photoDom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      setPhotoState('loading')
      const first = medias.slice(0, BatchSize)
      const assets = await proxyAssetsUrl(token, first)
      if (!assets) return

      setPhotoState('idle')
      mergeMediaAssets(first, assets)
      setPhotos(first)
    })()
  }, [token, medias])

  useEffect(() => {
    if (!photoDom.current) return

    const intersectionObserver = new IntersectionObserver(async (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && canLoadPhoto(medias, photos, photoState)) {
        // Load next batch
        setPhotoState('loading')
        const next = medias.slice(photos.length, photos.length + BatchSize)
        const assets = await proxyAssetsUrl(token, next)
        if (!assets) {
          setPhotoState('idle')
          return
        }

        setPhotoState('idle')
        mergeMediaAssets(next, assets)
        setPhotos([...photos, ...next])
      }
    })
    intersectionObserver.observe(photoDom.current)
    return () => intersectionObserver.disconnect()
  }, [token, medias])

  if (!photos.length) return null

  return (
    <div className={style.images}>
      <MediaModal
        isOpen={!!selectedMedia}
        media={selectedMedia}
        close={() => setSelectedMedia(undefined)}
      />
      {photoState === 'loading' && <h3>Loading medias</h3>}
      {photoState === 'idle' &&
        photos.map((media, index) => {
          const shouldBeBig = index % 13 === 0
          const key =
            media.type === 'video'
              ? VideoPosterDerivative
              : Object.keys(media.derivatives)[0]
          const backgroundImage = `url(${media.derivatives[key].url})`

          return (
            <div
              key={media.guid}
              className={cn(style.image, {
                [style['super-square']]: shouldBeBig
              })}
              style={{ backgroundImage }}
              onClick={() => setSelectedMedia(media)}
              ref={index === photos.length - 10 ? photoDom : undefined}
            />
          )
        })}
    </div>
  )
}

export default RideMedias
