import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'

import { Config, getConfig } from '../../libs/blog'
import { getMarkdown } from '../../libs/markdown'

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
  content: string
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
  const medias = stream
    ? getMediaList(stream).sort(
        (first, second) => first.createdAt - second.createdAt
      )
    : []

  const md = getMarkdown({})
  const content = md.render(gallery.description)

  return {
    props: {
      gallery,
      token,
      config,
      medias,
      content
    }
  }
}

const Gallery: NextPage<Props> = ({
  gallery,
  config,
  medias,
  token,
  content
}) => (
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
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
      <Medias token={token} medias={medias} />
    </main>
  </>
)
export default Gallery
