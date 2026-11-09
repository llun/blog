import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import {
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../libs/blog'
import PostList from '../../components/PostList'

const Index = () => {
  const posts = getAllPosts().sort(postDescendingComparison).slice(0, 20)
  return (
    <>
      <h1 className="sr-only">{getConfig().title}, latest posts</h1>
      <PostList posts={posts} />
      <div className="mt-10">
        <Link href="/posts/" className="key key-primary">
          View all posts
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </>
  )
}
export default Index
