import type { GetStaticProps } from 'next'
import Link from 'next/link'
import React from 'react'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  generateFeeds,
  postDescendingComparison
} from '../libs/blog'
import Header from '../components/Header'
import Meta from '../components/Meta'
import PostList from '../components/PostList'

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts().sort(postDescendingComparison).slice(0, 20)
  const config = getConfig()

  // TODO: Move this to place that run before page building code
  generateFeeds(config, posts)
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
      <Meta title={title} description={description} url={url} canonical={url} />
      <Header title={title} url={url} />
      <main>
        <PostList posts={posts} />
        <p>
          More posts can be found in <Link href="/posts/">the archive</Link>
        </p>
      </main>
    </>
  )
}
export default Index
