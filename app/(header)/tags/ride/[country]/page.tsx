import { Metadata } from 'next'
import Breadcrumbs from '../../../../../components/Breadcrumbs'
import PostList from '../../../../../components/PostList'
import { getAllPosts } from '../../../../../libs/blog'
import { countryPosts } from '../../../../../libs/related'
import JsonLd from '../../../../../components/JsonLd'
import React, { use } from 'react'

import RideMap from '../../../../../components/RideMap'
import RideStats from '../../../../../components/RideStats'
import PageHead from '../../../../../components/PageHead'
import RideNav from '../../../../../components/RideNav'

import {
  COUNTRIES_DATA,
  COUNTRY,
  countryIntro,
  getCountryCrumbs,
  getCountryJsonLd,
  getCountryMetadata
} from '../countries'
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
  return getCountryMetadata(country as COUNTRY, 'map')
}

const Ride = ({ params }: Props) => {
  const { country } = use(params)
  const { name, rideStat, map, youtubes } = COUNTRIES_DATA[country as COUNTRY]
  const posts = countryPosts(country, getAllPosts())
  return (
    <>
      <JsonLd data={getCountryJsonLd(country as COUNTRY, 'map')} />
      <Breadcrumbs crumbs={getCountryCrumbs(country as COUNTRY, 'map')} />
      <PageHead title={name} meta="Ride map" />
      <RideNav current={{ country, view: 'map' }} />
      <p className="ride-intro">
        {countryIntro(COUNTRIES_DATA[country as COUNTRY], 'map')}
      </p>
      <div className="ride-sections">
        <RideStats stats={rideStat} />
        <RideMap {...map} videos={youtubes} />
        <RideVideos videos={youtubes} />
        {posts.length > 0 && (
          <section aria-labelledby="country-posts">
            <h2 id="country-posts" className="page-section-title">
              Posts from {name}
            </h2>
            <PostList posts={posts} />
          </section>
        )}
      </div>
    </>
  )
}

export default Ride
