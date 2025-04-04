import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import {
  generateFeeds,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../libs/blog'
import PostList from '../../components/PostList'

const Index = () => {
  const config = getConfig()
  const posts = getAllPosts().sort(postDescendingComparison).slice(0, 20)
  generateFeeds(config, posts)
  return (
    <>
      <PostList posts={posts} />
      <div className="text-center mt-8">
        <Link href="/posts/" className="all-posts-link">
          View all posts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  )
}
export default Index
