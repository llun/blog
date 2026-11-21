import { Metadata } from 'next'
import React, { use } from 'react'

import { getMetadata } from '../../../../components/Meta'
import PageHead from '../../../../components/PageHead'
import PostList from '../../../../components/PostList'
import {
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../../libs/blog'
import { fitDescription, pageTitle, yearRange } from '../../../../libs/seo'

const getTagTitle = (tag: string) =>
  [tag[0].toLocaleUpperCase(), tag.slice(1)].join('')

// What each tag page is about, for its title and description
const TAG_INFO: Record<
  string,
  { topic: string; noun: string; summary: string }
> = {
  dev: {
    topic: 'Code: developer notes and side projects',
    noun: 'posts about code',
    summary:
      'JavaScript and TypeScript, cloud services, self-hosting on a Synology NAS, feeds, maps and the side projects behind this site'
  }
}

interface Props {
  params: Promise<{ tag: string }>
}

export const generateStaticParams = async () => {
  return [{ tag: 'dev' }]
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { tag } = await params
  const { url } = getConfig()
  const posts = getAllPosts().filter((post) => post.file.category === tag)
  const info = TAG_INFO[tag]
  const range = yearRange(posts.map((post) => post.timestamp))
  return getMetadata({
    url,
    path: `/tags/${tag}`,
    title: pageTitle(info?.topic ?? `${getTagTitle(tag)} posts`),
    description: fitDescription(
      `${posts.length} ${info?.noun ?? `${getTagTitle(tag)} posts`} on @แนท from ${range}${info ? `: ${info.summary}` : ''}.`,
      'Most posts are in Thai, some in English.'
    )
  })
}

const Tag = ({ params }: Props) => {
  const { tag } = use(params)
  const posts = getAllPosts()
    .filter((post) => post.file.category === tag)
    .sort(postDescendingComparison)

  return (
    <>
      <PageHead title={getTagTitle(tag)} meta={`${posts.length} posts`} />
      <PostList posts={posts} />
    </>
  )
}

export default Tag
