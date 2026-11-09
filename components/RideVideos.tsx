'use client'

import cn from 'classnames'
import React, { FC } from 'react'

export interface YoutubeVideo {
  title: string
  poster: string
  url: string
  stravaLink: string
  coordinates: [number, number]
}

interface Props {
  className?: string
  videos: YoutubeVideo[]
}

const RideVideos: FC<Props> = ({ videos, className }) => {
  if (!videos.length) return null

  return (
    <section className={cn('prose', className)}>
      <h2 className="mt-0 mb-3">Videos</h2>
      <ul className="my-0">
        {videos.map((video) => (
          <li key={video.url}>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              {video.title}
            </a>
            ,&nbsp;
            <a
              href={video.stravaLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Strava
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RideVideos
