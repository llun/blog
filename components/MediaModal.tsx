/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import React, { FC, useEffect, useRef } from 'react'
import ReactModal from 'react-modal'
import { Media } from '../libs/apple/media'

import style from './MediaModal.module.css'

const Photo: FC<{ media?: Media }> = ({ media }) => {
  const imageRef = useRef<HTMLImageElement>(null)

  if (media?.type !== 'photo') return null
  const qualities = Object.keys(media.derivatives)
  const best = qualities.pop()
  if (!best) return null

  const source = media.derivatives[best].url
  if (!source) return null

  return (
    <img
      className={style.image}
      ref={imageRef}
      src={source}
      alt="Hidden image"
      width={media.width}
      height={media.height}
    />
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
