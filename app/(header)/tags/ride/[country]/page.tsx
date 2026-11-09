import { Metadata } from 'next'
import React, { use } from 'react'

import { getMetadata } from '../../../../../components/Meta'
import RideMap from '../../../../../components/RideMap'
import RideStats from '../../../../../components/RideStats'
import PageHead from '../../../../../components/PageHead'
import RideNav from '../../../../../components/RideNav'

import { COUNTRIES_DATA, COUNTRY } from '../countries'
import RideVideos from '../../../../../components/RideVideos'

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

const Ride = ({ params }: Props) => {
  const { country } = use(params)
  const { name, rideStat, map, youtubes } = COUNTRIES_DATA[country as COUNTRY]
  return (
    <>
      <PageHead title={name} meta="Ride map" />
      <RideNav current={{ country, view: 'map' }} />
      <div className="ride-sections">
        <RideStats stats={rideStat} />
        <RideMap {...map} videos={youtubes} />
        <RideVideos videos={youtubes} />
      </div>
    </>
  )
}

export default Ride
