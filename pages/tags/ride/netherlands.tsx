import type { GetStaticProps, NextPage } from 'next'
import React from 'react'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../libs/blog'
import { fetchStream } from '../../../libs/apple/webstream'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'
import RideMedias from '../../../components/RideMedias'
import RideStats from '../../../components/RideStats'
import RideMap from '../../../components/RideMap'
import { getMediaList, Media } from '../../../libs/apple/media'
import { Navigation } from '.'

import rideStats from '../../../public/tags/ride/stats.json'

import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  posts: Post[]
  config: Config
  category: string
  medias: Media[]
}

export const NETHERLANDS_STREAM_ID = 'B125ON9t3mbLNC'

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
        <RideMap
          zoomLevels={[5.7, 6.0, 6.6]}
          minZoom={5}
          center={[5.12548838940261, 51.98430524939225]}
          dataPath="/tags/ride/netherlands.json"
        />
        <RideStats stats={rideStats.netherlands} />
        <RideMedias token={NETHERLANDS_STREAM_ID} medias={medias} />
      </main>
    </>
  )
}

export default Netherlands
