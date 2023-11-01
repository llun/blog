'use client'

import mapboxgl from 'mapbox-gl'
import React, { useEffect, useRef } from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'

import { MAPBOX_PUBLIC_KEY } from '../../../../libs/config'
import style from './airtag.module.css'

export const AirTagMap = () => {
  const mapEl = useRef<HTMLDivElement>(null)

  mapboxgl.accessToken = MAPBOX_PUBLIC_KEY

  useEffect(() => {
    const zoomLevel = (height?: number) => {
      switch (height) {
        case 250:
          return 3.2
        case 400:
          return 4
        default:
          return 4.8
      }
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [102.2949, 7.7051],
      zoom: zoomLevel(mapEl?.current?.offsetHeight),
      minZoom: 5
    })
    map.on('load', () => {
      // Start point
      new mapboxgl.Marker()
        .setLngLat([103.88710677294954, 1.312666851436666])
        .addTo(map)
      // Warehouse 12 - 17 February 2022
      new mapboxgl.Marker()
        .setLngLat([103.69348852496523, 1.3245446927261175])
        .addTo(map)
      // Ship loading 18 February 2022
      new mapboxgl.Marker()
        .setLngLat([103.82772984971787, 1.2696481908815793])
        .addTo(map)
      // Thailand custom control 28 February 2022
      new mapboxgl.Marker()
        .setLngLat([100.7621295498533, 13.740690427182491])
        .addTo(map)
      // Thailand warehouse
      new mapboxgl.Marker()
        .setLngLat([100.69514337047515, 13.55030367015619])
        .addTo(map)
      // Arrived
      new mapboxgl.Marker()
        .setLngLat([100.45907251285254, 13.880069579016235])
        .addTo(map)
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [103.88710677294954, 1.312666851436666],
              [103.83381280084181, 1.3257171435842245],
              [103.7959002560278, 1.311891911778024],
              [103.71032368715997, 1.3407441888059786],
              [103.69348852496523, 1.3245446927261175],
              [103.82772984971787, 1.2696481908815793],
              [100.7621295498533, 13.740690427182491],
              [100.76725355699101, 13.741084534618823],
              [100.6992644706041, 13.597544044582564],
              [100.69514337047515, 13.55030367015619],
              [100.52258561534529, 13.886406621322134],
              [100.534749849924, 13.8918938337937],
              [100.52682739887531, 13.8919896424992],
              [100.51966269589431, 13.885645124594866],
              [100.51192060403304, 13.886924461208979],
              [100.5229428306387, 13.88745630067037],
              [100.51279570589112, 13.906616783921542],
              [100.4520266057727, 13.884865023664105],
              [100.45907251285254, 13.880069579016235]
            ]
          }
        }
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
          'line-color': '#888',
          'line-width': 8
        }
      })
    })
  }, [])

  return <div ref={mapEl} id="map" className={style.map} />
}
