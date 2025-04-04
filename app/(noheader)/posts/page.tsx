import { Metadata } from 'next'
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { getMetadata } from '../../../components/Meta'
import PostList from '../../../components/PostList'
import { ThemeToggle } from '../../../components/ThemeToggle'
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
    <main className="main-container space-y-8 mt-4">
      <div className="post-header">
        <Link className="post-header-back-link" href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        <ThemeToggle />
      </div>

      <h2>All Posts</h2>
      <PostList posts={posts} />

      <Link className="post-header-back-link" href="/">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Home
      </Link>
    </main>
  )
}

export default Posts
