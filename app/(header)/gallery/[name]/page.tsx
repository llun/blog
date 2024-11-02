import { Metadata } from 'next'
import React from 'react'

import Medias from '../../../../components/Medias'
import { getMetadata } from '../../../../components/Meta'
import { getConfig } from '../../../../libs/blog'
import { getAlbum, getAllAlbums } from '../../../../libs/gallery'

import style from '../gallery.module.css'

export const generateStaticParams = async () => {
  return getAllAlbums().map(({ name }) => ({ name }))
}

interface Props {
  params: Promise<{ name: string }>
}
export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { name } = await params
  const { title, description, url } = getConfig()
  const data = await getAlbum(name)
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

const Gallery = async ({ params }: Props) => {
  const { name } = await params
  const data = await getAlbum(name)
  if (!data) return null

  const { partition, album, medias } = data
  return (
    <main>
      <h2 className={style.title}>{album.title}</h2>
      {album.content && (
        <div
          className={style.description}
          dangerouslySetInnerHTML={{ __html: album.content }}
        />
      )}
      <Medias partition={partition} token={album.token} medias={medias} />
    </main>
  )
}

export default Gallery
