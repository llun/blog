import type { GetStaticProps, NextPage } from 'next'
import React from 'react'

import { NETHERLANDS_ALBUM_TOKEN } from '../../../../libs/config'
import { Config, getConfig } from '../../../../libs/blog'
import { fetchStream } from '../../../../libs/apple/webstream'
import Header from '../../../../components/Header'
import Meta from '../../../../components/Meta'
import Medias from '../../../../components/Medias'
import RideStats from '../../../../components/RideStats'
import { getMediaList, Media } from '../../../../libs/apple/media'
import RideTitle from '../../../../components/RideTitle'

import rideStats from '../../../../public/tags/ride/stats.json'

import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  config: Config
  category: string
  medias: Media[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const config = getConfig()

  const stream = await fetchStream(NETHERLANDS_ALBUM_TOKEN)
  const medias = stream
    ? getMediaList(stream).sort(
        (first, second) => second.createdAt - first.createdAt
      )
    : []

  return {
    props: {
      config,
      category: 'ride',
      medias
    }
  }
}

const Netherlands: NextPage<Props> = ({ config, category, medias }) => (
  <>
    <Meta
      title={`${config.title}, ${category}`}
      description={config.description}
      url={`${config.url}/tags/ride/netherlands/gallery`}
      canonical={`${config.url}/tags/ride/netherlands/gallery/`}
      imageUrl={`${config.url}/tags/ride/netherlands.png`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <RideTitle
        icon={{
          src: '/img/icons/netherlands.png',
          alt: 'The Netherlands flag for ride in the Netherlands page'
        }}
      />
      <RideStats stats={rideStats.netherlands} />
      <Medias token={NETHERLANDS_ALBUM_TOKEN} medias={medias} />
    </main>
  </>
)

export default Netherlands
