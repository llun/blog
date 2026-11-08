import { Metadata } from 'next'
import React from 'react'

import AlbumList from '../../../components/AlbumList'
import { getMetadata } from '../../../components/Meta'
import { getConfig } from '../../../libs/blog'
import { getAllAlbums } from '../../../libs/gallery'

const { url, title, description } = getConfig()

export const metadata: Metadata = getMetadata({
  url,
  title: `${title}, Gallery`,
  description
})

const Gallery = () => {
  const albums = getAllAlbums()
  return (
    <>
      <h2 className="my-2">Image Gallery</h2>
      <AlbumList albums={albums.filter((album) => !album.section)} />
    </>
  )
}

export default Gallery
