import { Metadata } from 'next'
import React, { use } from 'react'

import { getMetadata } from '../../../../../components/Meta'
import RideMap from '../../../../../components/RideMap'
import RideStats from '../../../../../components/RideStats'
import RideTitle from '../../../../../components/RideTitle'

import { COUNTRIES_DATA, COUNTRY } from '../countries'
import RideVideos from '@/components/RideVideos'

interface Props {
  params: Promise<{ country: string }>
}

export const generateStaticParams = async () => {
  return [{ country: COUNTRY.NETHERLANDS }, { country: COUNTRY.SINGAPORE }]
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
  const { icon, rideStat, map } = COUNTRIES_DATA[country as COUNTRY]
  return (
    <main>
      <RideTitle icon={icon} />
      <RideStats stats={rideStat} />
      <RideMap {...map} videos={COUNTRIES_DATA[country as COUNTRY].youtubes} />
      <RideVideos videos={COUNTRIES_DATA[country as COUNTRY].youtubes} />
    </main>
  )
}

export default Ride
