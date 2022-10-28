import type { GetStaticProps, NextPage } from 'next'
import React from 'react'

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
import RideMedias from '../../../../components/RideMedias'
import RideStats from '../../../../components/RideStats'
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
      <RideMedias token={NETHERLANDS_STREAM_ID} medias={medias} />
    </main>
  </>
)

export default Netherlands
