import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import capitalize from 'lodash/capitalize'

import { Config, getConfig } from '../../libs/blog'

import Header from '../../components/Header'
import Meta from '../../components/Meta'
import Medias from '../../components/Medias'

import { APENHEUL_ALBUM_TOKEN, KEUKENHOF_ALBUM_TOKEN } from '../../libs/config'
import { fetchStream } from '../../libs/apple/webstream'
import { getMediaList, Media } from '../../libs/apple/media'

interface Props {
  name: string
  token: string
  config: Config
  medias: Media[]
}

type Params = {
  name: string
}

const AlbumNameMap = {
  apenheul: APENHEUL_ALBUM_TOKEN,
  keukenhof: KEUKENHOF_ALBUM_TOKEN
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { params: { name: 'apenheul' } },
    { params: { name: 'keukenhof' } }
  ]
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  if (!context.params) {
    return {
      notFound: true
    }
  }

  const { name } = context.params
  const config = getConfig()
  const token = AlbumNameMap[name]

  const stream = await fetchStream(token)
  const medias = stream ? getMediaList(stream) : []

  return {
    props: {
      name,
      token,
      config,
      medias
    }
  }
}

const Netherlands: NextPage<Props> = ({ config, medias, name, token }) => (
  <>
    <Meta
      title={`${config.title}, ${capitalize(name)}`}
      description={config.description}
      url={`${config.url}/gallery/${name}`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <h2>{capitalize(name)}</h2>
      <Medias token={token} medias={medias} />
    </main>
  </>
)

export default Netherlands
