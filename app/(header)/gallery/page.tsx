import { Metadata } from 'next'
import React from 'react'

import AlbumList from '../../../components/AlbumList'
import { getMetadata } from '../../../components/Meta'
import PageHead from '../../../components/PageHead'
import { getConfig } from '../../../libs/blog'
import { getAllAlbums } from '../../../libs/gallery'

const { url, title, description } = getConfig()

export const metadata: Metadata = getMetadata({
  url,
  title: `${title}, Gallery`,
  description
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
