'use client'

import cn from 'classnames'
import React, { CSSProperties, FC, useState } from 'react'
import { Media } from '../libs/apple/media'
import { VideoPosterDerivative } from '../libs/apple/webstream'

/** The small derivative: grid tiles and thumbnails. */
export const getThumbnailUrl = (media: Media) => {
  if (media.type === 'video') {
    return media.derivatives[VideoPosterDerivative]?.url
  }
  const [first] = Object.keys(media.derivatives)
  return media.derivatives[first]?.url
}

/** The large derivative the viewer shows (a video's poster frame). */
export const getLargeUrl = (media: Media) => {
  if (media.type === 'video') {
    return media.derivatives[VideoPosterDerivative]?.url
  }
  const [first, second] = Object.keys(media.derivatives)
  return media.derivatives[second ?? first]?.url
}

interface Props {
  src?: string
  alt: string
  className?: string
  imageClassName?: string
  style?: CSSProperties
  loading?: 'lazy' | 'eager'
  width?: number
  height?: number
  onError?: () => void
}

/**
 * A shimmering placeholder that the image fades in over once it has loaded.
 * Without `src` (its URL is still being fetched) only the shimmer shows.
 */
export const MediaImage: FC<Props> = ({ src, ...props }) => (
  // A new URL starts a fresh load, so the shimmer comes back
  <LoadingImage key={src ?? ''} src={src} {...props} />
)

const LoadingImage: FC<Props> = ({
  src,
  alt,
  className,
  imageClassName,
  style,
  loading = 'lazy',
  width,
  height,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <span
      className={cn('media-image', { skeleton: !isLoaded }, className)}
      style={style}
    >
      {src && (
        <img
          ref={(node) => {
            // Cached images can finish before React attaches onLoad
            if (node?.complete && node.naturalWidth > 0 && !isLoaded) {
              setIsLoaded(true)
            }
          }}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          draggable={false}
          className={cn(
            'media-image-img',
            { 'media-image-img-loaded': isLoaded },
            imageClassName
          )}
          onLoad={() => setIsLoaded(true)}
          onError={onError}
        />
      )}
    </span>
  )
}
