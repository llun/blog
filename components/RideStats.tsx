import React, { FC } from 'react'

interface Stats {
  distance: number
  activities: number
}

interface Props {
  stats: Stats
  className?: string
}

const RideStats: FC<Props> = ({ stats, className }) => (
  <section className={`ride-stats ${className}`}>
    <div className="ride-stats-card">
      <h2>Total Rides</h2>
      <p>{new Intl.NumberFormat('en').format(stats.activities)} Rides</p>
    </div>
    <div className="ride-stats-card">
      <h2>Total Distance</h2>
      <p>{new Intl.NumberFormat('en').format(stats.distance)} Kilometers</p>
    </div>
  </section>
)

export default RideStats
