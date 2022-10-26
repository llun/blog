import React, { FC } from 'react'

import style from './RideStats.module.css'

interface Stats {
  distance: number
  activities: number
}

interface Props {
  stats: Stats
}

const RideStats: FC<Props> = ({ stats }) => (
  <section className={style.stats}>
    <div className={style.card}>
      <h3>Total Rides</h3>
      <p>{new Intl.NumberFormat('en').format(stats.activities)} Rides</p>
    </div>
    <div className={style.card}>
      <h3>Total Distance</h3>
      <p>{new Intl.NumberFormat('en').format(stats.distance)} Kilometers</p>
    </div>
  </section>
)

export default RideStats
