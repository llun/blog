import { Metadata } from 'next'
import React from 'react'

import Medias from '../../../../../../components/Medias'
import { getMetadata } from '../../../../../../components/Meta'
import RideStats from '../../../../../../components/RideStats'
import PageHead from '../../../../../../components/PageHead'
import RideNav from '../../../../../../components/RideNav'
import { getMediaList } from '../../../../../../libs/apple/media'
import { fetchStream } from '../../../../../../libs/apple/webstream'

import { COUNTRIES_DATA, COUNTRY } from '../../countries'

interface Props {
  params: Promise<{ country: string }>
}

export const generateStaticParams = async () => {
  return [
    { country: COUNTRY.NETHERLANDS },
    { country: COUNTRY.SINGAPORE },
    { country: COUNTRY.SLOVENIA }
  ]
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { country } = await params
  const { meta } = COUNTRIES_DATA[country as COUNTRY]
  return getMetadata(meta)
}

const RideGallery = async ({ params }: Props) => {
  const { country } = await params
  const { name, rideStat, galleryToken } = COUNTRIES_DATA[country as COUNTRY]

  const stream = await fetchStream(galleryToken)
  const medias = stream
    ? getMediaList(stream).sort(
        (first, second) => second.createdAt - first.createdAt
      )
    : []

  return (
    <>
      <PageHead title={name} meta="Ride photos" />
      <RideNav current={{ country, view: 'photos' }} />
      <div className="ride-sections">
        <RideStats stats={rideStat} />
        <Medias
          partition={stream?.partition ?? 0}
          token={galleryToken}
          medias={medias}
        />
      </div>
    </>
  )
}

export default RideGallery
