import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { getConfig } from '../libs/blog'
import { getAlbum, getAllAlbums } from '../libs/gallery'
import Medias from './Medias'
import { getMetadata } from './Meta'

interface Props {
  params: Promise<{ name: string }>
}

// Builds the routes for one album page. `section` keeps each album under a
// single URL: plain albums live in /gallery, bird albums in /birds.
export const albumPage = (section?: string) => {
  const getSectionAlbum = async (name: string) => {
    const data = await getAlbum(name)
    return data && data.album.section === section ? data : null
  }

  const generateStaticParams = async () =>
    getAllAlbums()
      .filter((album) => album.section === section)
      .map(({ name }) => ({ name }))

  const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { name } = await params
    const { title, description, url } = getConfig()
    const data = await getSectionAlbum(name)
    if (!data) {
      return getMetadata({ url, title, description })
    }

    const { album } = data
    return getMetadata({
      url,
      title: `${title}, ${album.title}`,
      description: album.description,
      imageUrl: `${url}/gallery/${album.card}`
    })
  }

  const Page = async ({ params }: Props) => {
    const { name } = await params
    const data = await getSectionAlbum(name)
    if (!data) notFound()

    const { partition, album, medias } = data
    return (
      <>
        <h2 className="mt-2">{album.title}</h2>
        {album.content && (
          <div
            className="text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: album.content }}
          />
        )}
        <Medias partition={partition} token={album.token} medias={medias} />
      </>
    )
  }

  return { generateStaticParams, generateMetadata, Page }
}
