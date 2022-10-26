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

export const getStaticProps: GetStaticProps<Props> = async (context) => {
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

const Index: NextPage<Props> = ({ config, category, posts }) => {
  const { title, description, url } = config
  const pageTitle = [category[0].toLocaleUpperCase(), category.slice(1)].join(
    ''
  )

  return (
    <>
      <Meta
        title={`${title}, ${category}`}
        description={description}
        url={`${url}/tags/ride/`}
        imageUrl={`${url}/tags/ride/netherlands.png`}
      />
      <Header title={title} url={url} />
      <main>
        <RideTitle title={pageTitle} />
        <PostList posts={posts} />
      </main>
    </>
  )
}
export default Index
