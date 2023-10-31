import { Metadata } from 'next'
import path from 'path'
import React from 'react'

import { getMetadata } from '../../../../components/Meta'
import { getAllPosts, getConfig, parsePost } from '../../../../libs/blog'

import Link from 'next/link'
import { notFound } from 'next/navigation'
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
  params: { segment: string }
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
  const { segment } = params
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
  const { segment } = params
  const post = getPost(segment)
  if (!post) {
    return notFound()
  }

  const { properties, content } = post
  return (
    <main className={style.post}>
      <p>
        <Link href="/">← Home</Link>
      </p>

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
