'use client'

import cn from 'classnames'
import mapboxgl, { Map } from 'mapbox-gl'
import { useTheme } from 'next-themes'
import React, { FC, useEffect, useRef } from 'react'

import { MAPBOX_PUBLIC_KEY } from '@/libs/config'

import 'mapbox-gl/dist/mapbox-gl.css'
import { YoutubeVideo } from './RideVideos'

mapboxgl.accessToken = MAPBOX_PUBLIC_KEY

const LIGHT_STYLE = 'mapbox://styles/mapbox/light-v10'
const DARK_STYLE = 'mapbox://styles/mapbox/dark-v11'

interface Props {
  className?: string
  zoomLevels: [number, number, number]
  minZoom?: number
  maxZoom?: number
  center: [number, number]
  dataPath: string
  videos: YoutubeVideo[]
}

const getMarkerScale = (map: Map) => `scale(${1 + (map.getZoom() - 8) * 0.4})`

const RideMap: FC<Props> = ({
  className,
  zoomLevels,
  minZoom,
  maxZoom,
  center,
  dataPath,
  videos
}) => {
  const mapEl = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  const [mobile, tablet, desktop] = zoomLevels
  const [longitude, latitude] = center
  const videosKey = JSON.stringify(videos)

  useEffect(() => {
    const element = mapEl.current
    if (!element) return

    const markers = JSON.parse(videosKey) as YoutubeVideo[]

    const zoomLevel = (height?: number) => {
      switch (height) {
        case 250:
          return mobile
        case 400:
          return tablet
        default:
          return desktop
      }
    }
    const map = new mapboxgl.Map({
      container: element,
      style: resolvedTheme === 'dark' ? DARK_STYLE : LIGHT_STYLE,
      zoom: zoomLevel(element.offsetHeight),
      center: [longitude, latitude],
      minZoom,
      maxZoom
    })
    map.on('load', async () => {
      map.addSource('route', {
        type: 'geojson',
        data: dataPath
      })
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff2c2c',
          'line-width': 2
        }
      })
      for (const video of markers) {
        const link = document.createElement('a')
        link.href = video.url
        link.target = '_blank'
        link.rel = 'noopener noreferrer'

        const container = document.createElement('div')
        container.className = 'ride-map-marker-container'
        container.style.transform = getMarkerScale(map)

        const item = document.createElement('div')
        item.className = 'ride-map-marker-item'

        const image = document.createElement('img')
        image.src = video.poster
        image.className = 'ride-map-marker-image'
        item.appendChild(image)
        container.appendChild(item)

        link.appendChild(container)

        new mapboxgl.Marker(link).setLngLat(video.coordinates).addTo(map)
        map.on('zoom', () => {
          container.style.transform = getMarkerScale(map)
        })
      }
    })
    return () => map.remove()
  }, [
    mobile,
    tablet,
    desktop,
    longitude,
    latitude,
    minZoom,
    maxZoom,
    dataPath,
    videosKey,
    resolvedTheme
  ])

  return <div ref={mapEl} className={cn('ride-map', className)} />
}

export default RideMap
