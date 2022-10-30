import React from 'react'
import type { GetStaticProps, NextPage } from 'next'

import { SINGAPORE_ALBUM_TOKEN } from '../../../../libs/config'
import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../../libs/blog'
import Header from '../../../../components/Header'
import Meta from '../../../../components/Meta'
import RideMedias from '../../../../components/RideMedias'
import RideStats from '../../../../components/RideStats'
import { fetchStream } from '../../../../libs/apple/webstream'
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

  const stream = await fetchStream(SINGAPORE_ALBUM_TOKEN)
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

const Singapore: NextPage<Props> = ({ config, category, medias }) => (
  <>
    <Meta
      title={`${config.title}, ${category}`}
      description={config.description}
      url={`${config.url}/tags/ride/singapore`}
      imageUrl={`${config.url}/tags/ride/singapore.png`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <RideTitle
        icon={{
          src: '/img/icons/singapore.png',
          alt: 'Singapore flag for ride in Singapore page'
        }}
      />
      <RideStats stats={rideStats.singapore} />
      <RideMedias token={SINGAPORE_ALBUM_TOKEN} medias={medias} />
    </main>
  </>
)

export default Singapore
