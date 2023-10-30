import { Metadata } from 'next'
import React from 'react'

import { getMetadata } from '../../../../components/Meta'
import RideMap from '../../../../components/RideMap'
import RideStats from '../../../../components/RideStats'
import RideTitle from '../../../../components/RideTitle'
import { getConfig } from '../../../../libs/blog'

import rideStats from '../../../../public/tags/ride/stats.json'

export const generateMetadata = async (): Promise<Metadata> => {
  const { title, description, url } = getConfig()
  return getMetadata({
    title: `${title}, Netherlands`,
    description,
    imageUrl: `${url}/tags/ride/netherlands.png`
  })
}

const Ride = () => {
  return (
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
  )
}

export default Ride
