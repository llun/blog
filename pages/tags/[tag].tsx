import React from 'react'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../libs/blog'
import Header from '../../components/Header'
import Meta from '../../components/Meta'
import PostList from '../../components/PostList'

import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  posts: Post[]
  config: Config
  category: string
}

type Params = {
  tag: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{ params: { tag: 'dev' } }]
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
        url={`${url}/tags/${category}/`}
        canonical={`${url}/tags/${category}/`}
      />
      <Header title={title} url={url} />
      <main>
        <h2>{pageTitle}</h2>
        <PostList posts={posts} />
      </main>
    </>
  )
}
export default Index
