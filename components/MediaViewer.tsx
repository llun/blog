'use client'

import cn from 'classnames'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import React, {
  CSSProperties,
  FC,
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import { Media } from '../libs/apple/media'
import { Video720p } from '../libs/apple/webstream'

import { MediaImage, getLargeUrl, getThumbnailUrl } from './MediaImage'

// The full-screen viewer, ported from activities.next's MediasModal: a
// three-panel track (previous, current, next) that follows a swipe, arrow
// buttons and keys that wrap around, a counter and a thumbnail strip.

// A drag further than this (px) moves to the next photo, shorter snaps back
const MinSwipeDistance = 50
const SwipeDuration = 220
// Thumbnails either side of the current one whose URLs are fetched up front
const ThumbnailWindow = 12
const SwipeIgnoreSelector = 'button, a, video, audio'

interface Props {
  medias: Media[]
  initialIndex: number
  ensure: (indices: number[]) => void
  refresh: (index: number) => void
  onClose: () => void
}

const getAlt = (media: Media, index: number) =>
  media.caption?.trim() ||
  `${media.type === 'video' ? 'Video' : 'Photo'} ${index + 1}`

const MediaViewer: FC<Props> = ({
  medias,
  initialIndex,
  ensure,
  refresh,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [dragOffsetX, setDragOffsetX] = useState(0)
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false)
  const [pendingDirection, setPendingDirection] = useState<-1 | 0 | 1>(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const isSwipeGesture = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  const count = medias.length
  const wrap = useCallback(
    (index: number) => (count === 0 ? 0 : (index + count) % count),
    [count]
  )
  const previousIndex = wrap(currentIndex - 1)
  const nextIndex = wrap(currentIndex + 1)
  const showNavigation = count > 1

  const handlePrevious = useCallback(
    () => setCurrentIndex((index) => wrap(index - 1)),
    [wrap]
  )
  const handleNext = useCallback(
    () => setCurrentIndex((index) => wrap(index + 1)),
    [wrap]
  )

  // URLs for the photo on screen, its neighbours and nearby thumbnails
  useEffect(() => {
    const indices = [currentIndex, previousIndex, nextIndex]
    for (let offset = 1; offset <= ThumbnailWindow; offset++) {
      indices.push(currentIndex - offset, currentIndex + offset)
    }
    ensure(indices)
  }, [ensure, currentIndex, previousIndex, nextIndex])

  // Keyboard: arrows move, Escape closes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.key === 'Escape') onClose()
      if (!showNavigation) return
      if (event.key === 'ArrowLeft') handlePrevious()
      if (event.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handlePrevious, handleNext, showNavigation])

  // Lock the page behind, move focus in, and give it back on close
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const { body, documentElement } = document
    body.style.overflow = 'hidden'
    documentElement.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      body.style.overflow = ''
      documentElement.style.overflow = ''
      previousFocus?.focus?.()
    }
  }, [])

  // Keep the current thumbnail in view
  useEffect(() => {
    const strip = thumbnailsRef.current
    const thumbnail = strip?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!strip || !thumbnail) return
    const left =
      thumbnail.offsetLeft - strip.clientWidth / 2 + thumbnail.clientWidth / 2
    strip.scrollTo({ left, behavior: 'smooth' })
  }, [currentIndex])

  const resetSwipe = () => {
    touchStartX.current = null
    touchEndX.current = null
    isSwipeGesture.current = false
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!showNavigation || event.touches.length !== 1) return
    const target = event.target as HTMLElement | null
    if (target?.closest(SwipeIgnoreSelector)) {
      resetSwipe()
      return
    }
    isSwipeGesture.current = true
    setIsSwipeAnimating(false)
    setPendingDirection(0)
    touchStartX.current = event.touches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!isSwipeGesture.current || touchStartX.current === null) return
    touchEndX.current = event.touches[0].clientX
    setDragOffsetX(touchEndX.current - touchStartX.current)
  }

  const handleTouchEnd = () => {
    const startX = touchStartX.current
    const endX = touchEndX.current
    if (!isSwipeGesture.current || startX === null || endX === null) {
      setDragOffsetX(0)
      resetSwipe()
      return
    }

    const distance = endX - startX
    setIsSwipeAnimating(true)
    if (Math.abs(distance) > MinSwipeDistance) {
      const direction: -1 | 1 = distance < 0 ? 1 : -1
      const width = trackRef.current?.clientWidth ?? window.innerWidth
      setPendingDirection(direction)
      setDragOffsetX(direction === 1 ? -width : width)
    } else {
      setPendingDirection(0)
      setDragOffsetX(0)
    }
    resetSwipe()
  }

  const handleTouchCancel = () => {
    setIsSwipeAnimating(false)
    setPendingDirection(0)
    setDragOffsetX(0)
    resetSwipe()
  }

  const handleTransitionEnd = () => {
    if (!isSwipeAnimating) return
    if (pendingDirection !== 0) {
      setCurrentIndex((index) => wrap(index + pendingDirection))
    }
    setPendingDirection(0)
    setIsSwipeAnimating(false)
    setDragOffsetX(0)
  }

  const panels = showNavigation
    ? [previousIndex, currentIndex, nextIndex]
    : [currentIndex]

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      className="media-viewer"
      onClick={onClose}
    >
      <div className="media-viewer-bar" onClick={(e) => e.stopPropagation()}>
        <span className="media-viewer-count" aria-live="polite">
          {showNavigation && `${currentIndex + 1} / ${count}`}
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          className="media-viewer-button"
          onClick={onClose}
          aria-label="Close media viewer"
        >
          <XIcon aria-hidden="true" />
        </button>
      </div>

      <div className="media-viewer-stage">
        {showNavigation && (
          <>
            <button
              type="button"
              className="media-viewer-arrow media-viewer-arrow-previous"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              aria-label="Previous media"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </button>
            <button
              type="button"
              className="media-viewer-arrow media-viewer-arrow-next"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              aria-label="Next media"
            >
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </>
        )}

        <div
          ref={trackRef}
          className="media-viewer-viewport"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <div
            className={cn('media-viewer-track', {
              'media-viewer-track-single': !showNavigation
            })}
            style={
              showNavigation
                ? {
                    transform: `translateX(calc(-100% / 3 + ${dragOffsetX}px))`,
                    transition: isSwipeAnimating
                      ? `transform ${SwipeDuration}ms ease-out`
                      : 'none'
                  }
                : undefined
            }
            onTransitionEnd={handleTransitionEnd}
          >
            {panels.map((index, panel) => {
              const media = medias[index]
              const isCurrent = panel === (showNavigation ? 1 : 0)
              return (
                <div
                  // A two-photo album shows the same photo on both sides
                  key={`${media.guid}-${panel}`}
                  className="media-viewer-panel"
                  aria-hidden={!isCurrent}
                >
                  <ViewerMedia
                    media={media}
                    index={index}
                    isCurrent={isCurrent}
                    onError={() => refresh(index)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showNavigation && (
        <div
          ref={thumbnailsRef}
          className="media-viewer-thumbnails"
          onClick={(e) => e.stopPropagation()}
        >
          {medias.map((media, index) => (
            <button
              key={media.guid}
              type="button"
              className={cn('media-viewer-thumbnail', {
                'media-viewer-thumbnail-current': index === currentIndex
              })}
              aria-current={index === currentIndex ? 'true' : undefined}
              aria-label={`Show ${getAlt(media, index).toLowerCase()}`}
              onClick={() => setCurrentIndex(index)}
            >
              <MediaImage
                src={getThumbnailUrl(media)}
                alt=""
                className="media-viewer-thumbnail-image"
                onError={() => refresh(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}

interface ViewerMediaProps {
  media: Media
  index: number
  isCurrent: boolean
  onError: () => void
}

const ViewerMedia: FC<ViewerMediaProps> = ({
  media,
  index,
  isCurrent,
  onError
}) => {
  const ratio =
    media.width > 0 && media.height > 0 ? media.width / media.height : 1
  const poster = getLargeUrl(media)
  const video = media.derivatives[Video720p]?.url

  return (
    // Sized to the photo's own shape, so it shimmers in place while loading.
    // A click on it doesn't reach the backdrop, which closes the viewer.
    <div
      className="media-viewer-frame"
      style={{ '--ratio': ratio } as CSSProperties}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Only the photo on screen plays, so a neighbour never plays unseen */}
      {media.type === 'video' && isCurrent && video ? (
        <video
          key={video}
          src={video}
          poster={poster}
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          className="media-viewer-media"
          onError={onError}
        />
      ) : (
        <MediaImage
          src={poster}
          alt={getAlt(media, index)}
          loading="eager"
          width={media.width || undefined}
          height={media.height || undefined}
          className="media-viewer-media"
          onError={onError}
        />
      )}
    </div>
  )
}

export default MediaViewer
