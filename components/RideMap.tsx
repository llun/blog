'use client'

import mapboxgl from 'mapbox-gl'
import React, { FC, useEffect, useRef } from 'react'

import { MAPBOX_PUBLIC_KEY } from '../libs/config'

import style from './RideMap.module.css'

import 'mapbox-gl/dist/mapbox-gl.css'
import { YoutubeVideo } from './RideVideos'

interface Props {
  zoomLevels: [number, number, number]
  minZoom?: number
  maxZoom?: number
  center: [number, number]
  dataPath: string
  videos: YoutubeVideo[]
}

const RideMap: FC<Props> = ({
  zoomLevels,
  minZoom,
  maxZoom,
  center,
  dataPath,
  videos
}) => {
  const mapEl = useRef<HTMLDivElement>(null)
  mapboxgl.accessToken = MAPBOX_PUBLIC_KEY

  const [mobile, tablet, desktop] = zoomLevels
  useEffect(() => {
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
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: zoomLevel(mapEl?.current?.offsetHeight),
      center,
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
      for (const video of videos) {
        const link = document.createElement('a')
        link.href = video.url
        link.target = '_blank'

        const image = document.createElement('img')
        image.src = '/img/icons/television.png'
        image.width = 32
        image.height = 32
        image.style.border = '0'
        link.appendChild(image)

        new mapboxgl.Marker(link).setLngLat(video.coordinates).addTo(map)
      }
    })
  })

  return <div ref={mapEl} id="map" className={style.map} />
}

export default RideMap
