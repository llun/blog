import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import { useEffect } from 'react'

import { Journey } from '../../journey'
import { getConfig, Config } from '../../blog'
import Meta from '../../components/Meta'

import style from './airtag-sg-th.module.css'
import 'mapbox-gl/dist/mapbox-gl.css'

export async function getStaticProps() {
  const config = getConfig()
  return {
    props: {
      config
    }
  }
}

interface Props {
  config: Config
}

const Journey = ({ config }: Props) => {
  const { title, url } = config

  mapboxgl.accessToken =
    'pk.eyJ1IjoibGx1biIsImEiOiJja2FqN2k2djIwNDU5MnlvNjR4YXRrMzFsIn0.Oir7SYHkVKBlgbPHldtRGQ'

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [103.8198, 1.3521],
      zoom: 10
    })
    map.on('load', () => {
      // Start point
      new mapboxgl.Marker()
        .setLngLat([103.88710677294954, 1.312666851436666])
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
              [103.69348852496523, 1.3245446927261175]
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
  }, [config])

  return (
    <>
      <Meta
        title={`${title}, AirTag 🇸🇬 👉 🇹🇭`}
        description="Tracking my stuffs send through relocation service from Singapore to Thailand"
        url={`${url}/journeys/airtag-sg-th`}
      />
      <main>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
        <div>
          <h1>AirTag 🇸🇬 👉 🇹🇭</h1>
          <div id="map" className={style.map} />

          <h2>Timeline</h2>
          <ul>
            <li>
              <strong>11 Feb 2022, 09.45 SGT</strong> Packing everything to the
              box
            </li>
            <li>
              <strong>11 Feb 2022, 13.55 SGT</strong> Start moving from my place
            </li>
            <li>
              <strong>11 Feb 2022, 14.28 SGT</strong> On PIE near Lornie road
              (103.83381280084181, 1.3257171435842245)
            </li>
            <li>
              <strong>11 Feb 2022, 14.59 SGT</strong> Holland Village
              (103.7959002560278, 1.311891911778024)
            </li>
            <li>
              <strong>11 Feb 2022, 15.27 SGT</strong> On Boonlay way
              (103.71032368715997, 1.3407441888059786)
            </li>
            <li>
              <strong>11 Feb 2022, 16.11 SGT</strong> K C Dat Logistics pte
              (103.71032368715997, 1.3407441888059786)
            </li>
          </ul>
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
export default Journey
