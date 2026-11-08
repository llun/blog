import cn from 'classnames'
import React, { FC } from 'react'

interface Stats {
  distance: number
  activities: number
}

interface Props {
  stats: Stats
  className?: string
}

const format = (value: number) =>
  new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(value)

// One ruled strip: cells share their borders, a value over a mono label
const RideStats: FC<Props> = ({ stats, className }) => (
  <dl className={cn('ride-stats', className)}>
    <div className="ride-stats-cell">
      <dt className="ride-stats-label">Total rides</dt>
      <dd className="ride-stats-value">{format(stats.activities)}</dd>
    </div>
    <div className="ride-stats-cell">
      <dt className="ride-stats-label">Total distance, km</dt>
      <dd className="ride-stats-value">{format(stats.distance)}</dd>
    </div>
  </dl>
)

export default RideStats
