'use client'

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
    <div className={className}>
      <h2>Videos</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.url}>
            <a href={video.url} target="_blank">
              {video.title}
            </a>
            ,&nbsp;
            <a href={video.stravaLink} target="_blank">
              Strava
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RideVideos
