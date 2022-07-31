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
import PostList from '../../../components/PostList'

import 'mapbox-gl/dist/mapbox-gl.css'
import { Navigation } from '.'

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

interface Props {
  posts: Post[]
  config: Config
  category: string
}

const Index: NextPage<Props> = ({ posts, config, category }) => {
  const { title, description, url } = config
  const pageTitle = [category[0].toLocaleUpperCase(), category.slice(1)].join(
    ''
  )

  return (
    <>
      <Meta
        title={`${title}, ${category}`}
        description={description}
        url={url}
        imageUrl={`${url}/tags/ride/map.png?${Date.now()}`}
      />
      <Header title={title} url={url} />
      <main>
        <h1>{pageTitle}</h1>
        <Navigation />
        <PostList posts={posts} />
      </main>
    </>
  )
}
export default Index
