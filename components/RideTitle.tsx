import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'

import style from './RideTitle.module.css'

interface Props {
  icon: { src: string; alt: string }
}

const RideTitle: FC<Props> = ({ icon }) => (
  <section className={style.title}>
    <h3 className={style.navigation}>
      <Image
        className={style.icon}
        {...icon}
        alt="Page icon"
        width={24}
        height={24}
      />
      <Link
        href="/tags/ride/"
        className={style.item}
        aria-label="Link to post list"
      >
        Posts
      </Link>
      <Link
        href="/tags/ride/netherlands"
        className={style.item}
        aria-label="Link to my Netherlands cycling map"
      >
        Netherlands
      </Link>
      <Link href={`/tags/ride/netherlands/gallery`}>
        <Image
          className={style.icon}
          src="/img/icons/camera.png"
          alt="Ride medias gallery link"
          width={24}
          height={24}
        />
      </Link>
      <Link
        href="/tags/ride/singapore"
        className={style.item}
        aria-label="Link to my Singapore cycling map"
      >
        Singapore
      </Link>
      <Link href={`/tags/ride/singapore/gallery`}>
        <Image
          className={style.icon}
          src="/img/icons/camera.png"
          alt="Ride medias gallery link"
          width={24}
          height={24}
        />
      </Link>
    </h3>
  </section>
)

export default RideTitle
