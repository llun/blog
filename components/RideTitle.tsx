import Link from 'next/link'
import React, { FC } from 'react'

import style from './RideTitle.module.css'

interface Props {
  icon: { src: string; alt: string }
  ridePage?: string
}

const RideTitle: FC<Props> = ({ icon, ridePage }) => (
  <section className={style.title}>
    <h3 className={style.navigation}>
      <img className={style.icon} {...icon} />
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
      <Link
        href="/tags/ride/singapore"
        className={style.item}
        aria-label="Link to my Singapore cycling map"
      >
        Singapore
      </Link>
    </h3>

    {ridePage && (
      <h3>
        <Link href={`/tags/ride/${ridePage}`}>
          <img className={style.icon} src="/img/icons/map.png" />
        </Link>
        <Link href={`/tags/ride/${ridePage}/gallery`}>
          <img className={style.icon} src="/img/icons/camera.png" />
        </Link>
      </h3>
    )}
  </section>
)

export default RideTitle
