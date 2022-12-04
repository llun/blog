import React from 'react'
import type { GetStaticProps, NextPage } from 'next'

import {
  Config,
  getAllPosts,
  getConfig,
  Post,
  postDescendingComparison
} from '../../../libs/blog'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'
import PostList from '../../../components/PostList'
import RideTitle from '../../../components/RideTitle'

import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  posts: Post[]
  config: Config
  category: string
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const config = getConfig()
  const posts = getAllPosts()
    .filter((post) => post.file.category === 'ride')
    .sort(postDescendingComparison)
  return {
    props: {
      posts,
      config,
      category: 'ride'
    }
  }
}

const Index: NextPage<Props> = ({ config, category, posts }) => (
  <>
    <Meta
      title={`${config.title}, ${category}`}
      description={config.description}
      url={`${config.url}/tags/ride/`}
      canonical={`${config.url}/tags/ride/`}
      imageUrl={`${config.url}/tags/ride/netherlands.png`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <RideTitle
        icon={{ src: '/img/icons/ride.png', alt: 'Ride posts page icon' }}
      />
      <PostList posts={posts} />
    </main>
  </>
)
export default Index
