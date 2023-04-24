import type { GetStaticProps, NextPage } from 'next'
import React from 'react'

import Header from '../../../../components/Header'
import Meta from '../../../../components/Meta'
import RideMap from '../../../../components/RideMap'
import RideStats from '../../../../components/RideStats'
import RideTitle from '../../../../components/RideTitle'
import { Config, getConfig } from '../../../../libs/blog'

import rideStats from '../../../../public/tags/ride/stats.json'

import 'mapbox-gl/dist/mapbox-gl.css'

interface Props {
  config: Config
  category: string
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const config = getConfig()

  return {
    props: {
      config,
      category: 'ride'
    }
  }
}

const Netherlands: NextPage<Props> = ({ config, category }) => (
  <>
    <Meta
      title={`${config.title}, ${category}`}
      description={config.description}
      url={`${config.url}/tags/ride/netherlands`}
      canonical={`${config.url}/tags/ride/netherlands/`}
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
      <RideMap
        zoomLevels={[5.7, 6.0, 6.6]}
        minZoom={5}
        maxZoom={12}
        center={[5.12548838940261, 51.98430524939225]}
        dataPath="/tags/ride/netherlands.json"
      />
    </main>
  </>
)

export default Netherlands
