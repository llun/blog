/* eslint-disable @next/next/no-img-element */
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
  const [best] = qualities

  const source = media.derivatives[best].url
  if (!source) return null

  return (
    <img
      className="object-contain max-w-full max-h-[85vh] block border-none"
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
      className="object-contain max-w-full max-h-[85vh]"
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
      className="relative max-w-[95vw] md:max-w-4xl max-h-[90vh] w-full p-2 md:p-4 outline-none mx-auto my-[5vh] bg-background rounded-lg"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      ariaHideApp={typeof window !== 'undefined'}
    >
      <button
        onClick={close}
        className="absolute -top-2 -right-2 z-10 rounded-full bg-background/80 p-1.5 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring touch-manipulation"
        aria-label="Close modal"
      >
        <XIcon className="h-5 w-5" />
      </button>

      <div className="gallery-modal-content relative w-full h-full flex items-center justify-center bg-background rounded-lg overflow-hidden">
        <Photo media={media} />
        <Video media={media} />

        <div className="absolute inset-0 hidden md:flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={previous}
            disabled={currentMediaIndex === 0}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 touch-manipulation',
              currentMediaIndex === 0 && 'invisible' // Hide if first media
            )}
            aria-label="Previous media"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            disabled={currentMediaIndex === mediaLength - 1}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 touch-manipulation',
              currentMediaIndex === mediaLength - 1 && 'invisible' // Hide if last media and no more to load
            )}
            aria-label="Next media"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="fixed bottom-4 left-0 right-0 flex justify-center space-x-4 md:hidden">
          <button
            onClick={previous}
            disabled={currentMediaIndex === 0}
            className={cn(
              'rounded-full bg-background/80 p-3 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 touch-manipulation',
              currentMediaIndex === 0 && 'opacity-50'
            )}
            aria-label="Previous media"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={close}
            className="rounded-full bg-background/80 p-3 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring touch-manipulation"
            aria-label="Close gallery"
          >
            <XIcon className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            disabled={currentMediaIndex === mediaLength - 1}
            className={cn(
              'rounded-full bg-background/80 p-3 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 touch-manipulation',
              currentMediaIndex === mediaLength - 1 && 'opacity-50'
            )}
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
