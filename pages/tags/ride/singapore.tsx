import React, { FC, useEffect, useRef } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import mapboxgl from 'mapbox-gl'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../libs/blog'
import { MAPBOX_PUBLIC_KEY } from '../../../libs/config'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'
import { fetchStream } from '../../../libs/apple/webstream'
import { getMediaList, Media } from '../../../libs/apple/media'
import RideMedias from '../../../libs/components/RideMedias'
import { Navigation } from '.'

import rideStats from '../../../public/tags/ride/stats.json'

import style from './index.module.css'
import rideStyle from './ride.module.css'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  posts: Post[]
  config: Config
  category: string
  medias: Media[]
}

export const SINGAPORE_STREAM_ID = 'B12GqkRUiGojvkQ'

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const posts = getAllPosts()
    .filter((post) => post.file.category === 'ride')
    .sort(postDescendingComparison)
  const config = getConfig()

  const stream = await fetchStream(SINGAPORE_STREAM_ID)
  const medias = stream ? getMediaList(stream) : []

  return {
    props: {
      posts,
      config,
      category: 'ride',
      medias
    }
  }
}

const RideMap: FC = () => {
  const mapEl = useRef<HTMLDivElement>(null)
  mapboxgl.accessToken = MAPBOX_PUBLIC_KEY

  useEffect(() => {
    const zoomLevel = (height?: number) => {
      switch (height) {
        case 250:
          return 8
        case 400:
          return 9
        default:
          return 10.4
      }
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [103.81561802376315, 1.3498842996482667],
      zoom: zoomLevel(mapEl?.current?.offsetHeight),
      minZoom: 8,
      maxZoom: 12
    })
    map.scrollZoom.disable()
    map.on('load', async () => {
      map.addSource('route', {
        type: 'geojson',
        data: `/tags/ride/singapore.json`
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

const RideStats: FC = () => (
  <section className={rideStyle.stats}>
    <div className={rideStyle.card}>
      <h2>Total Rides</h2>
      <p>
        {new Intl.NumberFormat('en').format(rideStats.singapore.activities)}{' '}
        Rides
      </p>
    </div>
    <div className={rideStyle.card}>
      <h2>Total Distance</h2>
      <p>
        {new Intl.NumberFormat('en').format(rideStats.singapore.distance)}{' '}
        Kilometers
      </p>
    </div>
  </section>
)

const Singapore: NextPage<Props> = ({ config, category, medias }) => {
  const { title, description, url } = config
  const pageTitle = [category[0].toLocaleUpperCase(), category.slice(1)].join(
    ''
  )

  return (
    <>
      <Meta
        title={`${title}, ${category}`}
        description={description}
        url={`${url}/tags/ride/singapore`}
        imageUrl={`${url}/tags/ride/singapore.png`}
      />
      <Header title={title} url={url} />
      <main>
        <h1>{pageTitle}</h1>
        <Navigation />
        <RideMap />
        <RideStats />
        <RideMedias streamId={SINGAPORE_STREAM_ID} medias={medias} />
      </main>
    </>
  )
}
export default Singapore
