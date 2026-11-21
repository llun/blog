import { Metadata } from 'next'
import React from 'react'

import AlbumList from '../../../components/AlbumList'
import JsonLd from '../../../components/JsonLd'
import { getMetadata } from '../../../components/Meta'
import PageHead from '../../../components/PageHead'
import { getConfig } from '../../../libs/blog'
import { getAllAlbums } from '../../../libs/gallery'
import { fitDescription, pageTitle } from '../../../libs/seo'
import {
  breadcrumbList,
  collectionPage,
  graph
} from '../../../libs/structuredData'

const { url } = getConfig()
const birdCount = getAllAlbums().filter(
  (album) => album.section === 'birds'
).length

const seo = {
  url,
  path: '/birds',
  title: pageTitle('Birds: species I have photographed'),
  description: fitDescription(
    `${birdCount} bird species I have photographed, from tits and woodpeckers to kites and kingfishers. Each has its own page of photos, a map of where I saw it and an introduction from Wikipedia.`
  )
}

export const metadata: Metadata = getMetadata(seo)

const Birds = () => {
  const albums = getAllAlbums()
    .filter((album) => album.section === 'birds')
    .sort((first, second) => first.title.localeCompare(second.title))
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
              path: `/birds/${album.name}`
            }))
          }),
          breadcrumbList(url, [
            { name: 'Home', path: '/' },
            { name: 'Birds', path: seo.path }
          ])
        )}
      />
      <PageHead title="Birds" meta={`${albums.length} species`} />
      <AlbumList albums={albums} basePath="/birds" />
    </>
  )
}

export default Birds
