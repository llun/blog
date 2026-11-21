import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import {
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../libs/blog'
import JsonLd from '../../components/JsonLd'
import PostList from '../../components/PostList'
import { getMetadata } from '../../components/Meta'
import { HOME_DESCRIPTION, HOME_TITLE } from '../../libs/seo'
import {
  breadcrumbList,
  graph,
  personNode,
  websiteNode
} from '../../libs/structuredData'

export const metadata: Metadata = getMetadata({
  url: getConfig().url,
  path: '/',
  title: HOME_TITLE,
  description: HOME_DESCRIPTION
})

const Index = () => {
  const posts = getAllPosts().sort(postDescendingComparison).slice(0, 20)
  const { url } = getConfig()
  return (
    <>
      <JsonLd
        data={graph(
          websiteNode(url),
          personNode(url),
          breadcrumbList(url, [{ name: 'Home', path: '/' }])
        )}
      />
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
