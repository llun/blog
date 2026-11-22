import { Metadata } from 'next'
import React from 'react'

import Breadcrumbs from '../../../../components/Breadcrumbs'
import JsonLd from '../../../../components/JsonLd'
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
import {
  breadcrumbList,
  collectionPage,
  graph
} from '../../../../libs/structuredData'

const { url } = getConfig()
const ridePosts = getAllPosts().filter((post) => post.file.category === 'ride')

const seo = {
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
}

export const metadata: Metadata = getMetadata(seo)

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Ride', path: seo.path }
]

const Ride = () => {
  const posts = getAllPosts()
    .filter((post) => post.file.category === 'ride')
    .sort(postDescendingComparison)
  return (
    <>
      <JsonLd
        data={graph(
          collectionPage(url, {
            path: seo.path,
            name: seo.title,
            description: seo.description,
            image: seo.image,
            items: posts.map((post) => ({
              name: post.properties.title,
              path: `/posts/${post.file.id}`
            }))
          }),
          breadcrumbList(url, crumbs)
        )}
      />
      <Breadcrumbs crumbs={crumbs} />
      <PageHead title="Ride" meta={`${posts.length} posts`} />
      <RideNav />
      <PostList posts={posts} />
    </>
  )
}

export default Ride
