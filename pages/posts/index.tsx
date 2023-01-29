import type { GetStaticProps } from 'next'
import React from 'react'

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

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts().sort(postDescendingComparison)
  const config = getConfig()
  return {
    props: {
      posts,
      config
    }
  }
}

interface Props {
  posts: Post[]
  config: Config
}

const Index = ({ posts, config }: Props) => {
  const { title, description, url } = config
  return (
    <>
      <Meta
        title={`${title}, all posts`}
        description={description}
        url={url}
        canonical={`${url}/posts/`}
      />
      <Header title={title} url={url} />
      <main>
        <h2>All Posts</h2>
        <PostList posts={posts} />
      </main>
    </>
  )
}
export default Index
