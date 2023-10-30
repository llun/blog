import { Metadata } from 'next'
import React from 'react'

import Medias from '../../../../../components/Medias'
import { getMetadata } from '../../../../../components/Meta'
import RideStats from '../../../../../components/RideStats'
import RideTitle from '../../../../../components/RideTitle'
import { getMediaList } from '../../../../../libs/apple/media'
import { fetchStream } from '../../../../../libs/apple/webstream'
import { getConfig } from '../../../../../libs/blog'
import { NETHERLANDS_ALBUM_TOKEN } from '../../../../../libs/config'

import rideStats from '../../../../../public/tags/ride/stats.json'

export const generateMetadata = async (): Promise<Metadata> => {
  const { title, description, url } = getConfig()
  return getMetadata({
    title: `${title}, Netherlands`,
    description,
    imageUrl: `${url}/tags/ride/netherlands.png`
  })
}

const Ride = async () => {
  const stream = await fetchStream(NETHERLANDS_ALBUM_TOKEN)
  const medias = stream
    ? getMediaList(stream).sort(
        (first, second) => second.createdAt - first.createdAt
      )
    : []

  return (
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
  )
}

export default Ride
