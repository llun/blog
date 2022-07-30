import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'

import { MAPBOX_PUBLIC_KEY } from '../../../libs/config'
import { getConfig, Config } from '../../../libs/blog'
import Meta from '../../../components/Meta'
import { Calendar, getAllCalendars } from '../../../libs/amsterdam'

import style from './cycling.module.css'

import { getCalendarTitle } from './[calendar]'
import 'mapbox-gl/dist/mapbox-gl.css'

export async function getStaticProps() {
  const config = getConfig()
  const calendars = await getAllCalendars()
  return {
    props: {
      config,
      calendars
    }
  }
}

interface Props {
  config: Config
  calendars: Calendar[]
}

const AmsterdamCycling = ({ config, calendars }: Props) => {
  const router = useRouter()
  const { title, url } = config
  const mapEl = useRef<HTMLDivElement>(null)

  mapboxgl.accessToken = MAPBOX_PUBLIC_KEY

  useEffect(() => {
    for (const month of calendars) {
      router.prefetch(`/journeys/amsterdam/${month.id}`)
    }
  })

  useEffect(() => {
    const zoomLevel = (height?: number) => {
      switch (height) {
        case 250:
          return 6.8
        case 400:
          return 7
        default:
          return 7.3
      }
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [4.902218907700037, 52.37208643243944],
      zoom: zoomLevel(mapEl?.current?.offsetHeight),
      minZoom: 6.8
    })
    map.on('load', async () => {
      map.addSource('route', {
        type: 'geojson',
        data: `/journeys/amsterdam/cycling/geojson.json`
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
  }, [config])

  return (
    <>
      <Meta
        title={`${title}, Cycling map in Netherlands`}
        description="Cycling area in Netherlands"
        url={`${url}/journeys/amsterdam/cycling`}
        imageUrl={`${url}/journeys/amsterdam/cycling/map.png?${Date.now()}`}
      />
      <main className={style.cycling}>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
        <div>
          <h1>Cycling in Netherlands</h1>

          <div className={style.navigation}>
            <select
              value="-"
              onChange={(event) => {
                const { value } = event.currentTarget
                if (value === '-') {
                  return router.push(`/journeys/amsterdam`)
                }
                router.push(`/journeys/amsterdam/${value}`)
              }}
            >
              <option>-</option>
              {calendars.map((calendar) => {
                return (
                  <option key={calendar.id} value={calendar.id}>
                    {getCalendarTitle(calendar)}
                  </option>
                )
              })}
            </select>
            <Link href={'/journeys/amsterdam/cycling'}>Cycling</Link>
          </div>

          <div ref={mapEl} id="map" className={style.map} />
        </div>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
      </main>
    </>
  )
}
export default AmsterdamCycling
