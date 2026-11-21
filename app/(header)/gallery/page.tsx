import { Metadata } from 'next'
import React from 'react'

import AlbumList from '../../../components/AlbumList'
import Breadcrumbs from '../../../components/Breadcrumbs'
import JsonLd from '../../../components/JsonLd'
import { getMetadata } from '../../../components/Meta'
import PageHead from '../../../components/PageHead'
import { getConfig } from '../../../libs/blog'
import { getAllAlbums } from '../../../libs/gallery'
import { fitDescription, pageTitle, yearRange } from '../../../libs/seo'
import {
  breadcrumbList,
  collectionPage,
  graph
} from '../../../libs/structuredData'

const { url } = getConfig()
const galleryAlbums = getAllAlbums().filter((album) => !album.section)

const seo = {
  url,
  path: '/gallery',
  title: pageTitle('Gallery: photo albums from trips and events'),
  description: fitDescription(
    `${galleryAlbums.length} photo albums on @แนท from ${yearRange(galleryAlbums.map((album) => album.timestamp))}: trips around the Netherlands and Europe, Singapore, museums, flower parks, concerts and more.`
  )
}

export const metadata: Metadata = getMetadata(seo)

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: seo.path }
]

const Gallery = () => {
  const albums = getAllAlbums().filter((album) => !album.section)
  return (
    <>
      <JsonLd
        data={graph(
          collectionPage(url, {
            path: seo.path,
            name: seo.title,
            description: seo.description,
            items: albums.map((album) => ({
              name: album.title,
              path: `/gallery/${album.name}`
            }))
          }),
          breadcrumbList(url, crumbs)
        )}
      />
      <Breadcrumbs crumbs={crumbs} />
      <PageHead title="Gallery" meta={`${albums.length} albums`} />
      <AlbumList albums={albums} />
    </>
  )
}

export default Gallery
