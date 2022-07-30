import React, { FC, useEffect, useRef } from 'react'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import mapboxgl from 'mapbox-gl'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../libs/blog'
import { MAPBOX_PUBLIC_KEY } from '../../libs/config'
import Header from '../../components/Header'
import Meta from '../../components/Meta'
import PostList from '../../components/PostList'

import style from './[tag].module.css'
import 'mapbox-gl/dist/mapbox-gl.css'

type Params = {
  tag: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{ params: { tag: 'ride' } }, { params: { tag: 'dev' } }]
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  if (!context.params) {
    return {
      notFound: true
    }
  }

  const { tag } = context.params
  const posts = getAllPosts()
    .filter((post) => post.file.category === tag)
    .sort(postDescendingComparison)
  const config = getConfig()
  return {
    props: {
      posts,
      config,
      category: tag
    }
  }
}

interface Props {
  posts: Post[]
  config: Config
  category: string
}

const RideMap: FC<{ category: string }> = ({ category }) => {
  const mapEl = useRef<HTMLDivElement>(null)
  mapboxgl.accessToken = MAPBOX_PUBLIC_KEY

  useEffect(() => {
    if (category !== 'ride') return

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
        data: `/tags/ride/geojson.json`
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
  }, [category])

  if (category !== 'ride') return null
  return <div ref={mapEl} id="map" className={style.map} />
}

const Index: NextPage<Props> = ({ posts, config, category }) => {
  const { title, description, url } = config
  const pageTitle = [category[0].toLocaleUpperCase(), category.slice(1)].join(
    ''
  )
  const imageUrl =
    category === 'ride' ? `${url}/tags/ride/map.png?${Date.now()}` : undefined
  return (
    <>
      <Meta
        title={`${title}, ${category}`}
        description={description}
        url={url}
        imageUrl={imageUrl}
      />
      <Header title={title} url={url} />
      <main>
        <RideMap category={category} />
        <h1>{pageTitle}</h1>
        <PostList posts={posts} />
      </main>
    </>
  )
}
export default Index
