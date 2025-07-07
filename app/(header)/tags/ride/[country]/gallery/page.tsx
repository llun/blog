import { Metadata } from 'next'
import React from 'react'

import Medias from '../../../../../../components/Medias'
import { getMetadata } from '../../../../../../components/Meta'
import RideStats from '../../../../../../components/RideStats'
import RideTitle from '../../../../../../components/RideTitle'
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
  const { icon, rideStat, galleryToken } = COUNTRIES_DATA[country as COUNTRY]

  const stream = await fetchStream(galleryToken)
  const medias = stream
    ? getMediaList(stream).sort(
        (first, second) => second.createdAt - first.createdAt
      )
    : []

  return (
    <>
      <RideTitle className="mt-2" icon={icon} />
      <RideStats className="mt-4" stats={rideStat} />
      <Medias
        className="mt-4"
        partition={stream?.partition ?? 0}
        token={galleryToken}
        medias={medias}
      />
    </>
  )
}

export default RideGallery
