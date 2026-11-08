import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import AlbumList from '../../../../components/AlbumList'
import { getMetadata } from '../../../../components/Meta'
import { getConfig } from '../../../../libs/blog'
import { getAllAlbums } from '../../../../libs/gallery'

const { url, title, description } = getConfig()

export const metadata: Metadata = getMetadata({
  url,
  title: `${title}, Birds`,
  description
})

const Birds = () => {
  const albums = getAllAlbums()
    .filter((album) => album.section === 'birds')
    .sort((first, second) => first.title.localeCompare(second.title))
  return (
    <>
      <p className="mt-2">
        <Link href="/gallery">Gallery</Link>
      </p>
      <h2 className="my-2">Birds</h2>
      <AlbumList albums={albums} />
    </>
  )
}

export default Birds
