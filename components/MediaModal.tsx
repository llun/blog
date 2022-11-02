/* eslint-disable @next/next/no-img-element */
import React, { FC, MouseEventHandler, useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import cn from 'classnames'
import { Media } from '../libs/apple/media'
import { Video720p, VideoPosterDerivative } from '../libs/apple/webstream'

import CloseButton from '../public/img/fa/times.svg'
import PreviousButton from '../public/img/fa/chevron-left.svg'
import NextButton from '../public/img/fa/chevron-right.svg'

import style from './MediaModal.module.css'

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
      style={{ backgroundImage: `url(${background})` }}
      className={style.image}
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
    <div className={style.video} style={{ backgroundImage: `url(${poster})` }}>
      <video poster={poster} controls>
        <source src={source} type="video/mp4" />
      </video>
    </div>
  )
}

interface TitleProps extends MediaProps {
  className?: string
  onNext: MouseEventHandler<SVGElement>
  onPrevious: MouseEventHandler<SVGElement>
  onClose: MouseEventHandler<SVGElement>
}

const Title: FC<TitleProps> = ({
  className,
  media,
  onNext,
  onPrevious,
  onClose
}) => (
  <div className={cn(style.control, className)}>
    <div className={cn(style.title, style.expand)}>
      {media && (
        <>
          <PreviousButton
            className={cn(style.icon, style.previous)}
            onClick={onPrevious}
          />
          <span>
            {new Intl.DateTimeFormat('en-GB', {
              dateStyle: 'full',
              timeStyle: 'short'
            }).format(new Date(media?.createdAt))}
          </span>
          <NextButton className={cn(style.icon, style.next)} onClick={onNext} />
        </>
      )}
    </div>
    <CloseButton className={cn(style.icon, style.close)} onClick={onClose} />
  </div>
)

interface Props extends MediaProps {
  isOpen: boolean
  next: () => void
  previous: () => void
  close: () => void
}

const MediaModal: FC<Props> = ({ isOpen, media, next, previous, close }) => {
  const [shouldShowControl, setShouldShowControl] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    document.body.className = style.open
  }, [isOpen])

  return (
    <ReactModal
      overlayClassName={style.overlay}
      className={style.modal}
      isOpen={isOpen}
    >
      <div
        className={style.content}
        onClick={() => setShouldShowControl(!shouldShowControl)}
      >
        <Photo media={media} />
        <Video media={media} />
        <Title
          media={media}
          className={cn({ [style.hide]: !shouldShowControl })}
          onNext={(e) => {
            e.stopPropagation()
            next()
          }}
          onPrevious={(e) => {
            e.stopPropagation()
            previous()
          }}
          onClose={(e) => {
            e.stopPropagation()
            document.body.className = ''
            close()
          }}
        />
      </div>
    </ReactModal>
  )
}

export default MediaModal
