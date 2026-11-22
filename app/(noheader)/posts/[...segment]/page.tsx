import _ from 'lodash'
import { Metadata } from 'next'
import path from 'path'
import React, { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Map as MapIcon } from 'lucide-react'
import { DateTime } from 'luxon'

import { ThemeToggle } from '../../../../components/ThemeToggle'
import { getMetadata } from '../../../../components/Meta'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import { GalleryIcon } from '../../../../components/icons'
import JsonLd from '../../../../components/JsonLd'
import PageLink from '../../../../components/PageLink'
import Pager from '../../../../components/Pager'
import PostList from '../../../../components/PostList'
import { Post, getAllPosts, getConfig, parsePost } from '../../../../libs/blog'
import {
  Crumb,
  blogPosting,
  breadcrumbList,
  graph
} from '../../../../libs/structuredData'
import {
  adjacentPosts,
  postCountries,
  relatedPosts
} from '../../../../libs/related'
import {
  defaultImage,
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

// Title, description and social image, shared by the metadata and JSON-LD
const getPostSeo = (post: Post) => {
  const { url } = getConfig()
  const { properties, file, content, firstImage } = post
  const label = CATEGORY_LABEL[file.category ?? ''] ?? 'Life'
  const heroImage = properties.image
    ? { src: properties.image, alt: properties.title }
    : firstImage
  return {
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
    image:
      (heroImage &&
        socialImage(
          url,
          `posts/${file.id}/${heroImage.src}`,
          heroImage.alt || properties.title
        )) ||
      defaultImage(url, properties.title)
  }
}

// Home > Posts > (Code | Ride) > post
const getPostCrumbs = (post: Post): Crumb[] => [
  { name: 'Home', path: '/' },
  { name: 'Posts', path: '/posts' },
  ...(post.file.category
    ? [
        {
          name: CATEGORY_LABEL[post.file.category] ?? post.file.category,
          path: `/tags/${post.file.category}`
        }
      ]
    : []),
  { name: post.properties.title, path: `/posts/${post.file.id}` }
]

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { segment } = await params
  const post = getPost(segment)
  if (!post) {
    return getMetadata({
      url: getConfig().url,
      title: pageTitle('Post not found'),
      description: 'This post does not exist on @แนท.',
      noindex: true
    })
  }

  return getMetadata({
    ...getPostSeo(post),
    article: {
      publishedTime: toIsoDate(post.timestamp),
      modifiedTime: toIsoDate(post.modifiedTimestamp),
      tags: post.properties.tags
    }
  })
}

const PostPage = ({ params }: Props) => {
  const { segment } = use(params)
  const post = getPost(segment)
  if (!post) {
    return notFound()
  }

  const { properties, content } = post
  const seo = getPostSeo(post)
  const crumbs = getPostCrumbs(post)
  const allPosts = getAllPosts()
  const { older, newer } = adjacentPosts(post, allPosts)
  const related = relatedPosts(post, allPosts).filter(
    (other) =>
      other.file.id !== older?.file.id && other.file.id !== newer?.file.id
  )
  const countries = postCountries(post)
  const lang = getTextLang(
    `${properties.title} ${(content ?? '').slice(0, 4000)}`
  )
  return (
    <main className="main-container">
      <JsonLd
        data={graph(
          blogPosting(seo.url, post, seo.description, seo.image),
          breadcrumbList(seo.url, crumbs)
        )}
      />
      <div className="post-header">
        <Link className="key" href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>
        <ThemeToggle />
      </div>

      <Breadcrumbs crumbs={crumbs} />
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
          {post.file.category && (
            <span>
              <PageLink
                href={`/tags/${post.file.category}/`}
                className="post-meta-link"
              >
                {post.file.category}
              </PageLink>
            </span>
          )}
        </p>
      </header>

      <div
        className="post-body prose"
        lang={lang}
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />

      {countries.length > 0 && (
        <section className="page-section" aria-labelledby="post-rides">
          <h2 id="post-rides" className="page-section-title">
            Rides in {countries.map((country) => country.name).join(' and ')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {countries.flatMap((country) => [
              <Link
                key={`${country.slug}-map`}
                className="key"
                href={`/tags/ride/${country.slug}/`}
              >
                <MapIcon className="h-4 w-4" aria-hidden="true" />
                {country.name} ride map
              </Link>,
              <Link
                key={`${country.slug}-photos`}
                className="key"
                href={`/tags/ride/${country.slug}/gallery/`}
              >
                <GalleryIcon className="h-4 w-4" aria-hidden="true" />
                {country.name} ride photos
              </Link>
            ])}
          </div>
        </section>
      )}

      <section className="page-section">
        <Pager
          label="More posts"
          previous={
            older && {
              href: `/posts/${older.file.id}/`,
              title: older.properties.title
            }
          }
          previousLabel="Older post"
          next={
            newer && {
              href: `/posts/${newer.file.id}/`,
              title: newer.properties.title
            }
          }
          nextLabel="Newer post"
        />
      </section>

      {related.length > 0 && (
        <section className="page-section" aria-labelledby="post-related">
          <h2 id="post-related" className="page-section-title">
            Related posts
          </h2>
          <PostList posts={related} />
        </section>
      )}

      <Link className="key mt-10 mb-8" href="/">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Home
      </Link>
    </main>
  )
}

export default PostPage
