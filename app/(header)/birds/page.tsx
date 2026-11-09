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
  title: `${title}, Birds`,
  description
})

const Birds = () => {
  const albums = getAllAlbums()
    .filter((album) => album.section === 'birds')
    .sort((first, second) => first.title.localeCompare(second.title))
  return (
    <>
      <PageHead title="Birds" meta={`${albums.length} species`} />
      <AlbumList albums={albums} basePath="/birds" />
    </>
  )
}

export default Birds
