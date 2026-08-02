'use client'

import cn from 'classnames'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Media, mergeMediaAssets, proxyAssetsUrl } from '../libs/apple/media'
import { VideoPosterDerivative } from '../libs/apple/webstream'

import MediaModal from './MediaModal'

export enum PhotoState {
  LOADING,
  IDLE
}

const BatchSize = 24

function canLoadPhoto(
  allMedias: Media[],
  currentMedias: Media[],
  state: PhotoState
) {
  if (currentMedias.length === allMedias.length) return false
  if (state === PhotoState.LOADING) return false
  return true
}

interface Props {
  className?: string
  partition: number
  token: string
  medias: Media[]
}

const Medias: FC<Props> = ({ partition, token, medias, className }) => {
  const [photoState, setPhotoState] = useState<PhotoState>(PhotoState.IDLE)
  const [photos, setPhotos] = useState<Media[]>(medias.slice(0, BatchSize * 2))
  const [selectedMedia, setSelectedMedia] = useState<{
    media: Media
    index: number
  }>()
  const photoDom = useRef<HTMLButtonElement>(null)
  const failedOffset = useRef<number | null>(null)

  useEffect(() => {
    setPhotoState(PhotoState.LOADING)
    const firstBatch = medias.slice(0, BatchSize * 2)
    proxyAssetsUrl(partition, token, firstBatch)
      .then((assets) => {
        if (!assets) {
          setPhotoState(PhotoState.IDLE)
          return
        }

        setPhotoState(PhotoState.IDLE)
        mergeMediaAssets(firstBatch, assets)
        setPhotos(firstBatch)
      })
      .catch((error) => {
        console.error(error)
        setPhotoState(PhotoState.IDLE)
      })
  }, [partition, token, medias])

  useEffect(() => {
    if (!photoDom.current) return

    const intersectionObserver = new IntersectionObserver(async (entries) => {
      const entry = entries[0]
      if (!entry.isIntersecting) {
        failedOffset.current = null
        return
      }
      // Releasing the state back to IDLE re-runs this effect and the fresh
      // observer fires again on the still-visible sentinel, so a batch that
      // failed is only retried once the sentinel leaves and re-enters view
      if (failedOffset.current === photos.length) return
      if (!canLoadPhoto(medias, photos, photoState)) return

      // Load next batch
      setPhotoState(PhotoState.LOADING)
      const next = medias.slice(photos.length, photos.length + BatchSize)
      try {
        const assets = await proxyAssetsUrl(partition, token, next)
        if (!assets) {
          failedOffset.current = photos.length
          setPhotoState(PhotoState.IDLE)
          return
        }

        setPhotoState(PhotoState.IDLE)
        mergeMediaAssets(next, assets)
        setPhotos([...photos, ...next])
      } catch (error) {
        console.error(error)
        failedOffset.current = photos.length
        setPhotoState(PhotoState.IDLE)
      }
    })
    intersectionObserver.observe(photoDom.current)
    return () => intersectionObserver.disconnect()
  }, [partition, token, medias, photos, photoState])

  if (!photos.length) return null

  return (
    <div className={cn('ride-medias', className)}>
      <MediaModal
        isOpen={!!selectedMedia}
        media={selectedMedia?.media}
        currentMediaIndex={selectedMedia?.index ?? 0}
        mediaLength={medias.length}
        next={() => {
          if (!selectedMedia) return
          const nextMediaIndex = selectedMedia.index + 1
          if (nextMediaIndex > medias.length - 1) return
          const nextMedia = medias[nextMediaIndex]
          setSelectedMedia({ media: nextMedia, index: nextMediaIndex })
        }}
        previous={() => {
          if (!selectedMedia) return
          const previousMediaIndex = selectedMedia.index - 1
          if (previousMediaIndex < 0) return
          const previousMedia = medias[previousMediaIndex]
          setSelectedMedia({ media: previousMedia, index: previousMediaIndex })
        }}
        close={() => setSelectedMedia(undefined)}
      />
      {photos.map((media, index) => {
        const shouldBeBig = index % 13 === 0
        const keys = Object.keys(media.derivatives)
        const key = media.type === 'video' ? VideoPosterDerivative : keys[0]
        const backgroundImage =
          media.derivatives[key].url && `url(${media.derivatives[key].url})`
        const caption = media.caption?.trim()
        const label = caption
          ? `Open ${caption}`
          : `Open ${media.type === 'video' ? 'video' : 'photo'} ${index + 1}`

        return (
          <button
            key={media.guid}
            type="button"
            aria-label={label}
            className={cn('ride-medias-image', 'appearance-none block', {
              'ride-medias-super-square': shouldBeBig
            })}
            style={{ backgroundImage }}
            onClick={() => setSelectedMedia({ media, index })}
            ref={index === photos.length - 10 ? photoDom : undefined}
          />
        )
      })}
    </div>
  )
}

export default Medias
