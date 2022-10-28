import type { GetStaticProps, NextPage } from 'next'
import React from 'react'

import { NETHERLANDS_STREAM_ID } from '../../../../libs/config'
import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../../libs/blog'
import { fetchStream } from '../../../../libs/apple/webstream'
import Header from '../../../../components/Header'
import Meta from '../../../../components/Meta'
import RideStats from '../../../../components/RideStats'
import RideMap from '../../../../components/RideMap'
import { getMediaList, Media } from '../../../../libs/apple/media'
import RideTitle from '../../../../components/RideTitle'

import rideStats from '../../../../public/tags/ride/stats.json'

import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  posts: Post[]
  config: Config
  category: string
  medias: Media[]
}

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

const Netherlands: NextPage<Props> = ({ config, category, medias }) => (
  <>
    <Meta
      title={`${config.title}, ${category}`}
      description={config.description}
      url={`${config.url}/tags/ride/netherlands`}
      imageUrl={`${config.url}/tags/ride/netherlands.png`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <RideTitle
        icon={{
          src: '/img/icons/netherlands.png',
          alt: 'The Netherlands flag for ride in the Netherlands page'
        }}
      />
      <RideStats stats={rideStats.netherlands} />
      <RideMap
        zoomLevels={[5.7, 6.0, 6.6]}
        minZoom={5}
        center={[5.12548838940261, 51.98430524939225]}
        dataPath="/tags/ride/netherlands.json"
      />
    </main>
  </>
)

export default Netherlands
