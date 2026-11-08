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
  // Albums are sorted newest first, so the first bird album gives the Birds tile its cover.
  const latestBird = albums.find((album) => album.section === 'birds')
  const sections = latestBird
    ? [
        {
          ...latestBird,
          name: 'birds',
          title: 'Birds',
          description: 'Birds, one album per species'
        }
      ]
    : []
  return (
    <>
      <h2 className="my-2">Image Gallery</h2>
      <AlbumList
        albums={[...sections, ...albums.filter((album) => !album.section)]}
      />
    </>
  )
}

export default Gallery
