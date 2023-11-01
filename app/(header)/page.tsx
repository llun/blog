import Link from 'next/link'
import React from 'react'

import PostList from '../../components/PostList'
import {
  generateFeeds,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../libs/blog'

const Index = () => {
  const config = getConfig()
  const posts = getAllPosts().sort(postDescendingComparison).slice(0, 20)
  generateFeeds(config, posts)
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
