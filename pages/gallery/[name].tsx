import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import path from 'path'

import { Config, getConfig } from '../../libs/blog'

import Header from '../../components/Header'
import Meta from '../../components/Meta'
import Medias from '../../components/Medias'

import { Album, getAllAlbums, parseAlbum } from '../../libs/gallery'
import { fetchStream } from '../../libs/apple/webstream'
import { getMediaList, Media } from '../../libs/apple/media'

import style from './index.module.css'

interface Props {
  album: Album
  config: Config
  medias: Media[]
}

type Params = {
  name: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllAlbums().map(({ name }) => ({ params: { name } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  if (!context.params) return { notFound: true }

  const config = getConfig()

  const { name } = context.params
  const base = path.join(process.cwd(), 'contents', 'galleries')
  const file = path.join(base, `${name}.md`)
  const album = parseAlbum(config, file, true)

  if (!album) return { notFound: true }

  const token = album.token
  const stream = await fetchStream(token)
  const medias = stream
    ? getMediaList(stream).sort(
        (first, second) => first.createdAt - second.createdAt
      )
    : []

  return {
    props: {
      album,
      config,
      medias
    }
  }
}

const Gallery: NextPage<Props> = ({ album, config, medias }) => (
  <>
    <Meta
      title={`${config.title}, ${album.title}`}
      description={album.description}
      url={`${config.url}/gallery/${album.name}`}
      imageUrl={`${config.url}/gallery/${album.card}`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <h2 className={style.title}>{album.title}</h2>
      {album.content && (
        <div
          className={style.description}
          dangerouslySetInnerHTML={{ __html: album.content }}
        />
      )}
      <Medias token={album.token} medias={medias} />
    </main>
  </>
)
export default Gallery
