/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import React, { FC, useEffect, useRef } from 'react'
import ReactModal from 'react-modal'
import { Media } from '../libs/apple/media'
import { Video720p, VideoPosterDerivative } from '../libs/apple/webstream'

import style from './MediaModal.module.css'

const Photo: FC<{ media?: Media }> = ({ media }) => {
  const imageRef = useRef<HTMLImageElement>(null)

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
      ref={imageRef}
      src={source}
      alt="Detail image"
      width={media.width}
      height={media.height}
    />
  )
}

const Video: FC<{ media?: Media }> = ({ media }) => {
  if (media?.type !== 'video') return null
  const poster = media.derivatives[VideoPosterDerivative].url
  const source = media.derivatives[Video720p].url

  return (
    <div className={style.video}>
      <video poster={poster} controls>
        <source src={source} type="video/mp4" />
      </video>
    </div>
  )
}

type closeFn = () => void

interface Props {
  isOpen: boolean
  close: closeFn
  media?: Media
}

const closeModal = (close: closeFn) => {
  document.body.className = ''
  close()
}

const MediaModal: FC<Props> = ({ isOpen, media, close }) => {
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
      <div className={style.content} onClick={() => closeModal(close)}>
        <Photo media={media} />
        <Video media={media} />
        <Image
          className={style.closeButton}
          src={'/img/close-button.svg'}
          width={30}
          height={30}
          alt="Close selected image"
          onClick={() => closeModal(close)}
        />
      </div>
    </ReactModal>
  )
}

export default MediaModal
