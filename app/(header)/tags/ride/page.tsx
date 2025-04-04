import { Metadata } from 'next'
import React from 'react'

import { getMetadata } from '../../../../components/Meta'
import PostList from '../../../../components/PostList'
import RideTitle from '../../../../components/RideTitle'
import {
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../../libs/blog'

const { title, description, url } = getConfig()

export const metadata: Metadata = getMetadata({
  url,
  title: `${title}, Rides`,
  description,
  imageUrl: `${url}/tags/ride/netherlands.png`
})

const Ride = () => {
  const posts = getAllPosts()
    .filter((post) => post.file.category === 'ride')
    .sort(postDescendingComparison)
  return (
    <>
      <RideTitle className="mt-2" />
      <PostList posts={posts} />
    </>
  )
}

export default Ride
