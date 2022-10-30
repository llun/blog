import React from 'react'
import type { GetStaticProps, NextPage } from 'next'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../../libs/blog'
import Header from '../../../../components/Header'
import Meta from '../../../../components/Meta'
import RideStats from '../../../../components/RideStats'
import RideTitle from '../../../../components/RideTitle'
import RideMap from '../../../../components/RideMap'

import rideStats from '../../../../public/tags/ride/stats.json'

import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  posts: Post[]
  config: Config
  category: string
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const posts = getAllPosts()
    .filter((post) => post.file.category === 'ride')
    .sort(postDescendingComparison)
  const config = getConfig()

  return {
    props: {
      posts,
      config,
      category: 'ride'
    }
  }
}

const Singapore: NextPage<Props> = ({ config, category }) => (
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
      <RideMap
        zoomLevels={[8, 9, 10.4]}
        minZoom={8}
        maxZoom={12}
        center={[103.81561802376315, 1.3498842996482667]}
        dataPath="/tags/ride/singapore.json"
      />
    </main>
  </>
)

export default Singapore
