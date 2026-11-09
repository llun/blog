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

const getTagTitle = (tag: string) =>
  [tag[0].toLocaleUpperCase(), tag.slice(1)].join('')

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
  const { url, title, description } = getConfig()
  return getMetadata({
    url,
    title: `${title}, ${getTagTitle(tag)}`,
    description
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
