import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { getMetadata } from '../components/Meta'
import PostList from '../components/PostList'
import {
  generateFeeds,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../libs/blog'

export const metadata: Metadata = getMetadata({
  title: getConfig().title,
  description: getConfig().description
})

const Index = () => {
  const posts = getAllPosts().sort(postDescendingComparison).slice(0, 20)
  generateFeeds(getConfig(), posts)
  return (
    <main>
      <PostList posts={posts} />
      <p>
        More posts can be found in <Link href="/posts/">the archive</Link>
      </p>
    </main>
  )
}
export default Index
