import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'

import { Config, getConfig } from '../../libs/blog'

import Header from '../../components/Header'
import Meta from '../../components/Meta'
import Medias from '../../components/Medias'

import { fetchStream } from '../../libs/apple/webstream'
import { getMediaList, Media } from '../../libs/apple/media'
import { Galleries, Gallery } from '.'

interface Props {
  gallery: Gallery
  token: string
  config: Config
  medias: Media[]
}

type Params = {
  name: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Galleries.map(({ name }) => ({ params: { name } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  if (!context.params) return { notFound: true }

  const { name } = context.params
  const config = getConfig()
  const gallery = Galleries.find((gallery) => gallery.name === name)
  if (!gallery) return { notFound: true }

  const token = gallery.token
  const stream = await fetchStream(token)
  const medias = stream ? getMediaList(stream) : []

  return {
    props: {
      gallery,
      token,
      config,
      medias
    }
  }
}

const Gallery: NextPage<Props> = ({ gallery, config, medias, token }) => (
  <>
    <Meta
      title={`${config.title}, ${gallery.title}`}
      description={gallery.description}
      url={`${config.url}/gallery/${gallery.name}`}
      imageUrl={`${config.url}/gallery/${gallery.card}`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <h2>{gallery.title}</h2>
      <Medias token={token} medias={medias} />
    </main>
  </>
)

export default Gallery
