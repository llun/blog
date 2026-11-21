import { Metadata } from 'next'
import React from 'react'

import AlbumList from '../../../components/AlbumList'
import { getMetadata } from '../../../components/Meta'
import PageHead from '../../../components/PageHead'
import { getConfig } from '../../../libs/blog'
import { getAllAlbums } from '../../../libs/gallery'
import { fitDescription, pageTitle } from '../../../libs/seo'

const { url } = getConfig()
const birdCount = getAllAlbums().filter(
  (album) => album.section === 'birds'
).length

export const metadata: Metadata = getMetadata({
  url,
  path: '/birds',
  title: pageTitle('Birds: species I have photographed'),
  description: fitDescription(
    `${birdCount} bird species I have photographed, from tits and woodpeckers to kites and kingfishers. Each has its own page of photos, a map of where I saw it and an introduction from Wikipedia.`
  )
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
