'use client'

import React, { FC } from 'react'

export interface YoutubeVideo {
  title: string
  url: string
  coordinates: [number, number]
}

interface Props {
  videos: YoutubeVideo[]
}

const RideVideos: FC<Props> = ({ videos }) => {
  if (!videos.length) return null

  return (
    <div>
      <h2>Videos</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.url}>
            <a href={video.url} target="_blank">
              {video.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RideVideos
