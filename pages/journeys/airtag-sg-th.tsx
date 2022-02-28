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
      center: [102.2949, 7.7051],
      zoom: 4.8
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
              [100.7621295498533, 13.740690427182491]
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
          <h3>11 February 2022</h3>
          <ul>
            <li>
              <strong>09.45 SGT</strong> Packing everything to the box
            </li>
            <li>
              <strong>13.55 SGT</strong> Start moving from my place
            </li>
            <li>
              <strong>14.28 SGT</strong> On PIE near Lornie road
              (103.83381280084181, 1.3257171435842245)
            </li>
            <li>
              <strong>14.59 SGT</strong> Holland Village (103.7959002560278,
              1.311891911778024)
            </li>
            <li>
              <strong>15.27 SGT</strong> On Boonlay way (103.71032368715997,
              1.3407441888059786)
            </li>
            <li>
              <strong>16.11 SGT</strong> K C Dat Logistics pte
              (103.71032368715997, 1.3407441888059786)
            </li>
          </ul>
          <h3>12 - 17 February 2022</h3>
          <ul>
            <li>Stay at K C Dat Logistics pte</li>
          </ul>
          <h3>18 February 2022</h3>
          <ul>
            <li>
              <strong>15.05 ICT</strong> West Coast Highway near harbourfront
              (1.2696481908815793, 103.82772984971787)
            </li>
            <li>
              <strong>10.29 ICT</strong> Load to the ship
            </li>
          </ul>
          <h3>19 - 22 February 2022</h3>
          <ul>
            <li>In transit somewhere in the sea</li>
          </ul>
          <h3>23 - 28 February 2022</h3>
          <ul>
            <li>In transit somewhere in Thailand, loading to custom</li>
          </ul>
          <h3>28 February 2022</h3>
          <ul>
            <li>
              <strong>11.09 ICT</strong> In Thailand Custom at Ladkrabang Cargo
              Control Customs Office (13.740690427182491, 100.7621295498533)
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
