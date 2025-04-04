/* eslint-disable @next/next/no-img-element */
import React, { FC, MouseEventHandler, useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import cn from 'classnames'
import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react'
import { Media } from '../libs/apple/media'
import { Video720p, VideoPosterDerivative } from '../libs/apple/webstream'

interface MediaProps {
  media?: Media
}

const Photo: FC<MediaProps> = ({ media }) => {
  if (media?.type !== 'photo') return null
  const qualities = Object.keys(media.derivatives)
  const [small, best] = qualities

  const source = media.derivatives[best].url
  if (!source) return null

  const background = media.derivatives[small].url
  if (!background) return null

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
      onRequestClose={() => {
        close()
      }}
      contentLabel="Media Modal"
      className="relative max-w-4xl max-h-[90vh] w-full p-4 outline-none mx-auto my-[5vh] bg-background"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      ariaHideApp={typeof window !== 'undefined'}
    >
      <button
        onClick={(event) => {
          event.stopPropagation()
          close()
        }}
        className="absolute -top-2 -right-2 z-10 rounded-full bg-background/80 p-1.5 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        aria-label="Close modal"
      >
        <XIcon className="h-5 w-5" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center bg-background rounded-lg overflow-hidden">
        <Photo media={media} />
        <Video media={media} />

        <div className="absolute inset-0 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(event) => {
              event.stopPropagation()
              previous()
            }}
            disabled={currentMediaIndex === 0}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 cursor-pointer',
              currentMediaIndex === 0 && 'invisible'
            )}
            aria-label="Previous media"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation()
              next()
            }}
            disabled={currentMediaIndex === mediaLength - 1}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 cursor-pointer',
              currentMediaIndex === mediaLength - 1 && 'invisible'
            )}
            aria-label="Next media"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </ReactModal>
  )
}

export default MediaModal
