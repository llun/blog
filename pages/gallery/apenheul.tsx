import type { GetStaticProps, NextPage } from 'next'
import React from 'react'

import { Config, getConfig } from '../../libs/blog'

import Header from '../../components/Header'
import Meta from '../../components/Meta'
import Medias from '../../components/Medias'

import { APENHEUL_ALBUM_TOKEN } from '../../libs/config'
import { fetchStream } from '../../libs/apple/webstream'
import { getMediaList, Media } from '../../libs/apple/media'

interface Props {
  config: Config
  medias: Media[]
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const config = getConfig()

  const stream = await fetchStream(APENHEUL_ALBUM_TOKEN)
  const medias = stream ? getMediaList(stream) : []

  return {
    props: {
      config,
      medias
    }
  }
}

const Netherlands: NextPage<Props> = ({ config, medias }) => (
  <>
    <Meta
      title={`${config.title}, Apenheul`}
      description={config.description}
      url={`${config.url}/gallery/apenheul`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <h2>Apenheul</h2>
      <Medias token={APENHEUL_ALBUM_TOKEN} medias={medias} />
    </main>
  </>
)

export default Netherlands
