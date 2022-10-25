import React from 'react'
import type { GetStaticProps, NextPage } from 'next'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../libs/blog'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'
import RideMedias from '../../../components/RideMedias'
import RideStats from '../../../components/RideStats'
import { fetchStream } from '../../../libs/apple/webstream'
import { getMediaList, Media } from '../../../libs/apple/media'
import { Navigation } from '.'

import rideStats from '../../../public/tags/ride/stats.json'

import 'mapbox-gl/dist/mapbox-gl.css'
import RideMap from '../../../components/RideMap'

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
        <RideMap
          zoomLevels={[8, 9, 10.4]}
          minZoom={8}
          maxZoom={12}
          center={[103.81561802376315, 1.3498842996482667]}
          dataPath="/tags/ride/singapore.json"
        />
        <RideStats stats={rideStats.singapore} />
        <RideMedias token={SINGAPORE_STREAM_ID} medias={medias} />
      </main>
    </>
  )
}
export default Singapore
