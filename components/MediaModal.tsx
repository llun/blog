/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import React, { FC, useEffect, useRef, useState } from 'react'
import ReactModal from 'react-modal'
import EXIF from 'exif-js'
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

interface Props {
  isOpen: boolean
  close: () => void
  media?: Media
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
      <div className={style.media}>
        <Photo media={media} />
      </div>
      <div className={style.control}>
        <Image
          className={style.closeButton}
          src={'/img/close-button.svg'}
          width={30}
          height={30}
          alt="Close selected image"
          onClick={() => {
            document.body.className = ''
            close()
          }}
        />
      </div>
    </ReactModal>
  )
}

export default MediaModal
