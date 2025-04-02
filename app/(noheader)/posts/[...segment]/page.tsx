import { Metadata } from 'next'
import path from 'path'
import React, { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { ThemeToggle } from '@/components/ThemeToggle'

import { getMetadata } from '../../../../components/Meta'
import { getAllPosts, getConfig, parsePost } from '../../../../libs/blog'

import style from './post.module.css'

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
      <div className="flex items-center justify-between">
        <Link
          className="inline-flex items-center gap-1 text-lg font-light"
          href="/"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <ThemeToggle />
      </div>

      <div className={style.title}>
        <h1>{properties.title}</h1>
      </div>

      <div
        className={style.content}
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />

      <p>
        <Link href="/">← Home</Link>
      </p>
    </main>
  )
}

export default Post
