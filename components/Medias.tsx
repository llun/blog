'use client'

import cn from 'classnames'
import { VideoIcon } from 'lucide-react'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Media } from '../libs/apple/media'

import { MediaImage, getThumbnailUrl } from './MediaImage'
import MediaViewer from './MediaViewer'
import { BatchSize, useMediaAssets } from './useMediaAssets'

// Tiles from the end of the grid that start the next batch when they scroll
// into view
const LoadAheadTiles = 10

interface Props {
  className?: string
  partition: number
  token: string
  medias: Media[]
}

const getLabel = (media: Media, index: number) => {
  const caption = media.caption?.trim()
  if (caption) return `Open ${caption}`
  return `Open ${media.type === 'video' ? 'video' : 'photo'} ${index + 1}`
}

const Medias: FC<Props> = ({ partition, token, medias, className }) => {
  const { version, ensure, refresh, isLoaded } = useMediaAssets(
    partition,
    token,
    medias
  )
  // Batches the grid shows: the newest one appears as shimmering tiles while
  // its URLs load
  const [batches, setBatches] = useState(2)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const sentinel = useRef<HTMLButtonElement>(null)

  const shownCount = Math.min(medias.length, batches * BatchSize)

  useEffect(() => {
    setBatches(2)
  }, [medias])

  useEffect(() => {
    ensure(Array.from({ length: shownCount }, (_, index) => index))
  }, [ensure, shownCount])

  useEffect(() => {
    const target = sentinel.current
    if (!target) return
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return
      // Also retries a batch that failed, each time the sentinel comes back
      ensure(Array.from({ length: shownCount }, (_, index) => index))
      // Add the next batch only once the last one has its URLs, so a failing
      // API doesn't fill the page with shimmering tiles
      if (shownCount < medias.length && isLoaded(shownCount - 1)) {
        setBatches((value) => value + 1)
      }
    })
    observer.observe(target)
    return () => observer.disconnect()
    // version: re-observe once a batch lands, so a still-visible sentinel
    // carries on loading
  }, [ensure, isLoaded, shownCount, medias.length, version])

  if (!medias.length) return null

  const sentinelIndex = Math.max(0, shownCount - LoadAheadTiles)

  return (
    <div className={cn('ride-medias', className)}>
      {medias.slice(0, shownCount).map((media, index) => (
        <button
          key={media.guid}
          type="button"
          aria-label={getLabel(media, index)}
          className={cn('ride-medias-image', {
            'ride-medias-super-square': index % 13 === 0
          })}
          onClick={() => setSelectedIndex(index)}
          ref={index === sentinelIndex ? sentinel : undefined}
        >
          <MediaImage
            src={getThumbnailUrl(media)}
            alt=""
            className="ride-medias-tile"
            onError={() => refresh(index)}
          />
          {media.type === 'video' && (
            <span className="ride-medias-badge" aria-hidden="true">
              <VideoIcon />
            </span>
          )}
        </button>
      ))}
      {selectedIndex !== null && (
        <MediaViewer
          medias={medias}
          initialIndex={selectedIndex}
          ensure={ensure}
          refresh={refresh}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  )
}

export default Medias
