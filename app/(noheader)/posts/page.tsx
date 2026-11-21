import { Metadata } from 'next'
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { getMetadata } from '../../../components/Meta'
import PageHead from '../../../components/PageHead'
import PostList from '../../../components/PostList'
import { ThemeToggle } from '../../../components/ThemeToggle'
import {
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../libs/blog'
import { fitDescription, pageTitle, yearRange } from '../../../libs/seo'

export const generateMetadata = async (): Promise<Metadata> => {
  const { url } = getConfig()
  const posts = getAllPosts()
  return getMetadata({
    url,
    path: '/posts',
    title: pageTitle('All posts on life, cycling and code'),
    description: fitDescription(
      `Every post on @แนท, ${posts.length} of them from ${yearRange(posts.map((post) => post.timestamp))}: life in Singapore and the Netherlands, ride reports and gear, and notes on code and self-hosting, mostly in Thai.`
    )
  })
}

const Posts = () => {
  const posts = getAllPosts().sort(postDescendingComparison)

  return (
    <main className="main-container">
      <div className="post-header">
        <Link className="key" href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>
        <ThemeToggle />
      </div>

      <PageHead title="All posts" meta={`${posts.length} posts`} />
      <PostList posts={posts} />

      <div className="mt-10 mb-8">
        <Link className="key" href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>
      </div>
    </main>
  )
}

export default Posts
