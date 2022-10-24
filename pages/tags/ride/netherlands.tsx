import type { GetStaticProps, NextPage } from 'next'
import React, { FC, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
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
    map.scrollZoom.disable()
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
  const [photos, setPhotos] = useState<Media[]>([])

  useEffect(() => {
    ;(async () => {
      const assets = await proxyAssetsUrl(NETHERLANDS_STREAM_ID, medias)
      if (!assets) return

      mergeMediaAssets(medias, assets)
      setPhotos(medias)
    })()
  }, [medias])

  if (!photos.length) return null

  return (
    <div className={rideStyle.images}>
      {photos.map((media, index) => {
        const directionClass =
          media.width > media.height
            ? rideStyle.wide
            : media.width < media.height
            ? rideStyle.tall
            : ''

        const random = Math.ceil(Math.random() * 1000)

        const shouldBeBig = random % 11 === 0
        const shouldExpand = random % 7 === 0 && !shouldBeBig

        if (media.type === 'video') {
          return (
            <div
              key={media.guid}
              className={cn(rideStyle.image, {
                [directionClass]: shouldExpand,
                [rideStyle['super-square']]: shouldBeBig
              })}
              style={{
                backgroundImage: `url(${media.derivatives[VideoPosterDerivative].url})`
              }}
            />
          )
        }

        const keys = Object.keys(media.derivatives).sort(
          (second, first) => parseInt(first, 10) - parseInt(second, 10)
        )

        return (
          <div
            key={media.guid}
            className={cn(rideStyle.image, {
              [directionClass]: shouldExpand,
              [rideStyle['super-square']]: shouldBeBig
            })}
            style={{
              backgroundImage: `url(${media.derivatives[keys[0]].url})`
            }}
          />
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
        <RideMedias medias={medias} />
      </main>
    </>
  )
}

export default Netherlands
