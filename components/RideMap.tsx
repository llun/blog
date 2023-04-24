import mapboxgl from 'mapbox-gl'
import React, { FC, useEffect, useRef } from 'react'

import { MAPBOX_PUBLIC_KEY } from '../libs/config'

import style from './RideMap.module.css'

import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  zoomLevels: [number, number, number]
  minZoom?: number
  maxZoom?: number
  center: [number, number]
  dataPath: string
}

const RideMap: FC<Props> = ({
  zoomLevels,
  minZoom,
  maxZoom,
  center,
  dataPath
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
          'line-color': 'red',
          'line-width': 2
        }
      })
    })
  })

  return <div ref={mapEl} id="map" className={style.map} />
}

export default RideMap
