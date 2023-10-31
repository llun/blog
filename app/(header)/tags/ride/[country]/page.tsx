import { Metadata } from 'next'
import React from 'react'

import { getMetadata } from '../../../../../components/Meta'
import RideMap from '../../../../../components/RideMap'
import RideStats from '../../../../../components/RideStats'
import RideTitle from '../../../../../components/RideTitle'

import { COUNTRIES_DATA, COUNTRY } from '../countries'

interface Props {
  params: { country: string }
}

export const generateStaticParams = async () => {
  return [{ country: COUNTRY.NETHERLANDS }, { country: COUNTRY.SINGAPORE }]
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { country } = params
  const { meta } = COUNTRIES_DATA[country as COUNTRY]
  return getMetadata(meta)
}

const Ride = ({ params }: Props) => {
  const { country } = params
  const { icon, rideStat, map } = COUNTRIES_DATA[country as COUNTRY]
  return (
    <main>
      <RideTitle icon={icon} />
      <RideStats stats={rideStat} />
      <RideMap {...map} />
    </main>
  )
}

export default Ride
