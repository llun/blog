import { Metadata } from 'next'
import path from 'path'
import React, { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { DateTime } from 'luxon'

import { ThemeToggle } from '../../../../components/ThemeToggle'
import { getMetadata } from '../../../../components/Meta'
import { getAllPosts, getConfig, parsePost } from '../../../../libs/blog'

const getPost = (segment: string) => {
  const config = getConfig()
  const contentPath = path.join(
    process.cwd(),
    'contents',
    'posts',
    ...segment,
    'index.md'
  )
  return parsePost(config, contentPath, true)
}

interface Props {
  params: Promise<{ segment: string }>
}

export const generateStaticParams = async () => {
  const posts = getAllPosts()
  return posts.map((post) => ({
    segment: post.file.id.split('/')
  }))
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { segment } = await params
  const { url, title, description } = getConfig()
  const post = getPost(segment)
  if (!post) {
    return getMetadata({
      url,
      title,
      description
    })
  }

  const { properties, file } = post
  return getMetadata({
    url,
    title: `${title}, ${properties.title}`,
    description: properties.description,
    imageUrl: properties.image
      ? `${url}/posts/${file.id}/${properties.image}`
      : null
  })
}

const Post = ({ params }: Props) => {
  const { segment } = use(params)
  const post = getPost(segment)
  if (!post) {
    return notFound()
  }

  const { properties, content } = post
  return (
    <main className="main-container">
      <div className="post-header">
        <Link className="post-header-back-link" href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        <ThemeToggle />
      </div>

      <header className="space-y-2 mb-4">
        <h1 className="post-title">{properties.title}</h1>
        <p className="post-date">
          Published on{' '}
          {DateTime.fromMillis(post.timestamp)
            .setLocale('en-US')
            .toLocaleString(DateTime.DATE_MED)}
        </p>
      </header>

      <div
        className="space-y-6 mb-4"
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />

      <Link className="post-header-back-link" href="/">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Home
      </Link>
    </main>
  )
}

export default Post
