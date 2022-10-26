import Link from 'next/link'
import React, { FC } from 'react'

import style from './RideTitle.module.css'

interface Props {
  title: string
}

const RideTitle: FC<Props> = ({ title }) => (
  <section>
    <h3 className={style.navigation}>
      <span className={style.title}>{title}</span>
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
  </section>
)

export default RideTitle
