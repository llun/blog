'use client'

import mapboxgl from 'mapbox-gl'
import { useTheme } from 'next-themes'
import React, { FC, useEffect, useRef } from 'react'

import { MAPBOX_PUBLIC_KEY } from '@/libs/config'

import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = MAPBOX_PUBLIC_KEY

interface Props {
  dataPath: string
}

// One dot for each place the species was photographed.
const BirdMap: FC<Props> = ({ dataPath }) => {
  const mapEl = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const element = mapEl.current
    if (!element) return

    const dark = resolvedTheme === 'dark'
    const map = new mapboxgl.Map({
      container: element,
      style: dark
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v10',
      center: [10, 50],
      zoom: 3
    })
    map.on('load', async () => {
      const data = (await (await fetch(dataPath)).json()) as {
        type: 'FeatureCollection'
        features: { geometry: { coordinates: [number, number] } }[]
      }
      map.addSource('photos', { type: 'geojson', data: dataPath })
      map.addLayer({
        id: 'photos',
        type: 'circle',
        source: 'photos',
        paint: {
          'circle-radius': 6,
          'circle-color': dark ? '#ffffff' : '#000000',
          'circle-stroke-width': 2,
          'circle-stroke-color': dark ? '#000000' : '#ffffff'
        }
      })
      const bounds = new mapboxgl.LngLatBounds()
      for (const feature of data.features) {
        bounds.extend(feature.geometry.coordinates)
      }
      if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 60, maxZoom: 9 })
    })
    return () => map.remove()
  }, [dataPath, resolvedTheme])

  return <div ref={mapEl} className="h-[250px] md:h-[400px]" />
}

export default BirdMap
