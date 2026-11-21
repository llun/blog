import { Metadata } from 'next'
import React from 'react'

import { getMetadata } from '../../../../components/Meta'
import PostList from '../../../../components/PostList'
import PageHead from '../../../../components/PageHead'
import RideNav from '../../../../components/RideNav'
import {
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../../libs/blog'
import {
  fitDescription,
  pageTitle,
  socialImage,
  yearRange
} from '../../../../libs/seo'

const { url } = getConfig()
const ridePosts = getAllPosts().filter((post) => post.file.category === 'ride')

export const metadata: Metadata = getMetadata({
  url,
  path: '/tags/ride',
  title: pageTitle('Ride: cycling stories, maps and gear'),
  description: fitDescription(
    `${ridePosts.length} cycling posts on @แนท from ${yearRange(ridePosts.map((post) => post.timestamp))}: rides around Singapore, Gran Fondo and Festive 500, bikes and gear, with ride maps of Singapore, the Netherlands and Slovenia.`
  ),
  image: socialImage(
    url,
    'tags/ride/netherlands.png',
    'Ride heatmap of the Netherlands'
  )
})

const Ride = () => {
  const posts = getAllPosts()
    .filter((post) => post.file.category === 'ride')
    .sort(postDescendingComparison)
  return (
    <>
      <PageHead title="Ride" meta={`${posts.length} posts`} />
      <RideNav />
      <PostList posts={posts} />
    </>
  )
}

export default Ride
