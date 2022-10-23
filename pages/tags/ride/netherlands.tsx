import React, { FC, useEffect, useRef, useState } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import mapboxgl from 'mapbox-gl'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../libs/blog'
import {
  fetchStream,
  VideoPosterDerivative
} from '../../../libs/apple/webstream'
import { MAPBOX_PUBLIC_KEY } from '../../../libs/config'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'
import { Navigation } from '.'

import rideStats from '../../../public/tags/ride/stats.json'

import style from './index.module.css'
import rideStyle from './ride.module.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  getMediaList,
  Media,
  mergeMediaAssets,
  proxyAssetsUrl
} from '../../../libs/apple/media'

interface Props {
  posts: Post[]
  config: Config
  category: string
  medias: Media[]
}

const NETHERLANDS_STREAM_ID = 'B125ON9t3mbLNC'

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const posts = getAllPosts()
    .filter((post) => post.file.category === 'ride')
    .sort(postDescendingComparison)
  const config = getConfig()

  const stream = await fetchStream(NETHERLANDS_STREAM_ID)
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
          return 5.7
        case 400:
          return 6.0
        default:
          return 6.6
      }
    }
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [5.12548838940261, 51.98430524939225],
      zoom: zoomLevel(mapEl?.current?.offsetHeight),
      minZoom: 5
    })
    map.on('load', async () => {
      map.addSource('route', {
        type: 'geojson',
        data: `/tags/ride/netherlands.json`
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
        {new Intl.NumberFormat('en').format(rideStats.netherlands.activities)}{' '}
        Rides
      </p>
    </div>
    <div className={rideStyle.card}>
      <h2>Total Distance</h2>
      <p>
        {new Intl.NumberFormat('en').format(rideStats.netherlands.distance)}{' '}
        Kilometers
      </p>
    </div>
  </section>
)

const RideMedias: FC<{ medias: Media[] }> = ({ medias }) => {
  if (!medias.length) return null

  return (
    <div className={rideStyle.images}>
      {medias.map((media) => {
        if (media.type === 'video') {
          return (
            <div key={media.guid}>
              <img
                className={rideStyle.image}
                src={media.derivatives[VideoPosterDerivative].url}
              />
            </div>
          )
        }

        const keys = Object.keys(media.derivatives).sort(
          (first, second) => parseInt(first, 10) - parseInt(second, 10)
        )

        return (
          <div key={media.guid}>
            <img
              className={rideStyle.image}
              src={media.derivatives[keys[0]].url}
            />
          </div>
        )
      })}
    </div>
  )
}

const Netherlands: NextPage<Props> = ({ config, category, medias }) => {
  const { title, description, url } = config
  const pageTitle = [category[0].toLocaleUpperCase(), category.slice(1)].join(
    ''
  )
  const [photos, setPhotos] = useState<Media[]>([])

  useEffect(() => {
    ;(async () => {
      const first = medias.slice(0, 18)
      const assets = await proxyAssetsUrl(NETHERLANDS_STREAM_ID, first)
      if (!assets) return

      mergeMediaAssets(first, assets)
      setPhotos(first)
    })()
  })

  return (
    <>
      <Meta
        title={`${title}, ${category}`}
        description={description}
        url={`${url}/tags/ride/netherlands`}
        imageUrl={`${url}/tags/ride/netherlands.png`}
      />
      <Header title={title} url={url} />
      <main>
        <h1>{pageTitle}</h1>
        <Navigation />
        <RideMap />
        <RideStats />
        <RideMedias medias={photos} />
      </main>
    </>
  )
}

export default Netherlands
