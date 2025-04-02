import { Metadata } from 'next'
import React from 'react'

import { getMetadata } from '../../../components/Meta'
import PostList from '../../../components/PostList'
import {
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../libs/blog'

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, title, description } = getConfig()
  return getMetadata({
    url,
    title: `${title}, all posts`,
    description
  })
}

const Posts = () => {
  const posts = getAllPosts().sort(postDescendingComparison)

  return (
    <main className="main-container space-y-8">
      <h2 className="text-4xl">All Posts</h2>
      <PostList posts={posts} />
    </main>
  )
}

export default Posts
