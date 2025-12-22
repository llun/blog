import React, { FC } from 'react'
import ReactModal from 'react-modal'
import cn from 'classnames'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import { Media } from '../libs/apple/media'
import { Video720p, VideoPosterDerivative } from '../libs/apple/webstream'

interface MediaProps {
  media?: Media
}

const Photo: FC<MediaProps> = ({ media }) => {
  if (media?.type !== 'photo') return null
  const qualities = Object.keys(media.derivatives)
  const [, best] = qualities

  const source = media.derivatives[best].url
  if (!source) return null

  return (
    <img
      className="media-modal-image"
      src={source}
      alt="Detail image"
      width={media.width}
      height={media.height}
    />
  )
}

const Video: FC<MediaProps> = ({ media }) => {
  if (media?.type !== 'video') return null
  const poster = media.derivatives[VideoPosterDerivative].url
  const source = media.derivatives[Video720p].url

  return (
    <video
      src={source}
      poster={poster}
      controls
      className="media-modal-video"
      playsInline
      controlsList="nodownload"
      autoPlay
    >
      Your browser does not support the video tag.
    </video>
  )
}

interface Props extends MediaProps {
  isOpen: boolean
  currentMediaIndex: number
  mediaLength: number
  next: () => void
  previous: () => void
  close: () => void
}

const MediaModal: FC<Props> = ({
  isOpen,
  media,
  currentMediaIndex,
  mediaLength,
  next,
  previous,
  close
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      contentLabel="Media Modal"
      className="media-modal"
      overlayClassName="media-modal-overlay"
      ariaHideApp={typeof window !== 'undefined'}
    >
      <button
        onClick={close}
        className="media-modal-close-button"
        aria-label="Close modal"
      >
        <XIcon className="h-5 w-5" />
      </button>

      <div className="media-modal-content">
        <Photo media={media} />
        <Video media={media} />

        <div className="media-modal-navigation">
          <button
            onClick={previous}
            disabled={currentMediaIndex === 0}
            className={cn('media-modal-navigation-button', {
              invisible: currentMediaIndex === 0
            })}
            aria-label="Previous media"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            disabled={currentMediaIndex === mediaLength - 1}
            className={cn('media-modal-navigation-button', {
              invisible: currentMediaIndex === mediaLength - 1
            })}
            aria-label="Next media"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="media-modal-navigation-mobile">
          <button
            onClick={previous}
            disabled={currentMediaIndex === 0}
            className={cn('media-modal-navigation-mobile-button', {
              'opacity-50': currentMediaIndex === 0
            })}
            aria-label="Previous media"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={close}
            className="media-modal-navigation-mobile-button"
            aria-label="Close gallery"
          >
            <XIcon className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            disabled={currentMediaIndex === mediaLength - 1}
            className={cn('media-modal-navigation-mobile-button', {
              'opacity-50': currentMediaIndex === mediaLength - 1
            })}
            aria-label="Next media"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </ReactModal>
  )
}

export default MediaModal
