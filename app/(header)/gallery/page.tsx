import { Metadata } from 'next'
import React from 'react'

import AlbumList from '../../../components/AlbumList'
import { getMetadata } from '../../../components/Meta'
import PageHead from '../../../components/PageHead'
import { getConfig } from '../../../libs/blog'
import { getAllAlbums } from '../../../libs/gallery'
import { fitDescription, pageTitle, yearRange } from '../../../libs/seo'

const { url } = getConfig()
const galleryAlbums = getAllAlbums().filter((album) => !album.section)

export const metadata: Metadata = getMetadata({
  url,
  path: '/gallery',
  title: pageTitle('Gallery: photo albums from trips and events'),
  description: fitDescription(
    `${galleryAlbums.length} photo albums on @แนท from ${yearRange(galleryAlbums.map((album) => album.timestamp))}: trips around the Netherlands and Europe, Singapore, museums, flower parks, concerts and more.`
  )
})

const Gallery = () => {
  const albums = getAllAlbums().filter((album) => !album.section)
  return (
    <>
      <PageHead title="Gallery" meta={`${albums.length} albums`} />
      <AlbumList albums={albums} />
    </>
  )
}

export default Gallery
