import _ from 'lodash'
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
import {
  firstParagraph,
  fitDescription,
  monthYear,
  pageTitle,
  socialImage,
  toIsoDate
} from '../../../../libs/seo'
import { getTextLang, isSinglePathSegment } from '../../../../libs/utils'

const getPost = _.memoize(
  (segment: string[]) => {
    if (!segment.every(isSinglePathSegment)) {
      return null
    }

    const config = getConfig()
    const contentPath = path.join(
      process.cwd(),
      'contents',
      'posts',
      ...segment,
      'index.md'
    )
    return parsePost(config, contentPath, true)
  },
  (segment: string[]) => JSON.stringify(segment)
)

interface Props {
  params: Promise<{ segment: string[] }>
}

export const generateStaticParams = async () => {
  const posts = getAllPosts()
  return posts.map((post) => ({
    segment: post.file.id.split('/')
  }))
}

const CATEGORY_LABEL: Record<string, string> = {
  dev: 'Code',
  ride: 'Ride'
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { segment } = await params
  const { url } = getConfig()
  const post = getPost(segment)
  if (!post) {
    return getMetadata({
      url,
      title: pageTitle('Post not found'),
      description: 'This post does not exist on @แนท.',
      noindex: true
    })
  }

  const { properties, file, content, firstImage } = post
  const label = CATEGORY_LABEL[file.category ?? ''] ?? 'Life'
  const heroImage = properties.image
    ? { src: properties.image, alt: properties.title }
    : firstImage
  return getMetadata({
    url,
    path: `/posts/${file.id}`,
    title: pageTitle(
      properties.title,
      `${label} post, ${monthYear(post.timestamp)}`
    ),
    description: fitDescription(
      properties.description,
      firstParagraph(content),
      `A ${label.toLowerCase()} post on @แนท from ${monthYear(post.timestamp)}.`,
      '@แนท is a personal blog about life, cycling and code.'
    ),
    image: heroImage
      ? socialImage(
          url,
          `posts/${file.id}/${heroImage.src}`,
          heroImage.alt || properties.title
        )
      : null,
    article: {
      publishedTime: toIsoDate(post.timestamp),
      modifiedTime: toIsoDate(post.modifiedTimestamp),
      tags: properties.tags
    }
  })
}

const Post = ({ params }: Props) => {
  const { segment } = use(params)
  const post = getPost(segment)
  if (!post) {
    return notFound()
  }

  const { properties, content } = post
  const lang = getTextLang(
    `${properties.title} ${(content ?? '').slice(0, 4000)}`
  )
  return (
    <main className="main-container">
      <div className="post-header">
        <Link className="key" href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>
        <ThemeToggle />
      </div>

      <header className="post-head">
        <h1 className="post-title" lang={getTextLang(properties.title)}>
          {properties.title}
        </h1>
        <p className="post-meta">
          <time dateTime={properties.date}>
            {DateTime.fromMillis(post.timestamp)
              .setLocale('en-US')
              .toFormat('dd LLL yyyy')}
          </time>
          {post.file.category && <span>{post.file.category}</span>}
        </p>
      </header>

      <div
        className="post-body prose"
        lang={lang}
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />

      <Link className="key" href="/">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Home
      </Link>
    </main>
  )
}

export default Post
