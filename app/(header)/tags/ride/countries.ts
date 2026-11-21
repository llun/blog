import { Metadata } from 'next'

import { getMetadata } from '../../../../components/Meta'
import { getConfig } from '../../../../libs/blog'
import { fitDescription, pageTitle, socialImage } from '../../../../libs/seo'
import { CountryData } from './types'

import { SINGAPORE } from './singapore'
import { NETHERLANDS } from './netherlands'
import { SLOVENIA } from './slovenia'

export enum COUNTRY {
  NETHERLANDS = 'netherlands',
  SINGAPORE = 'singapore',
  SLOVENIA = 'slovenia'
}

export const COUNTRIES_DATA: Record<COUNTRY, CountryData> = {
  [COUNTRY.NETHERLANDS]: NETHERLANDS,
  [COUNTRY.SINGAPORE]: SINGAPORE,
  [COUNTRY.SLOVENIA]: SLOVENIA
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(value)

/** "13,879 km over 304 rides", from the Strava stats in stats.json */
export const rideSummary = ({ rideStat }: CountryData) =>
  `${formatNumber(rideStat.distance)} km over ${formatNumber(rideStat.activities)} rides`

export const getCountryMetadata = (
  country: COUNTRY,
  view: 'map' | 'photos'
): Metadata => {
  const data = COUNTRIES_DATA[country]
  const { url } = getConfig()
  const summary = rideSummary(data)
  if (view === 'map') {
    return getMetadata({
      url,
      path: `/tags/ride/${country}`,
      title: pageTitle(`${data.name} ride map`, summary),
      description: fitDescription(
        `Map of every ride I recorded in ${data.name}: ${summary}, drawn from Strava as one route heatmap.`,
        data.youtubes.length > 0
          ? `With ${data.youtubes.length} ride videos pinned on the map.`
          : null,
        `Ride stats, photos and posts from ${data.name} on @แนท.`
      ),
      image: socialImage(url, data.image, `Ride heatmap of ${data.name}`)
    })
  }
  return getMetadata({
    url,
    path: `/tags/ride/${country}/gallery`,
    title: pageTitle(`${data.name} ride photos`, summary),
    description: fitDescription(
      `Photos taken on my rides in ${data.name}, ${summary}, from a shared iCloud album.`,
      `See the ride map of ${data.name} for every route and the ride posts on @แนท for the stories.`
    ),
    image: socialImage(url, data.image, `Ride heatmap of ${data.name}`),
    // The photo grid has no text of its own; the map page is the one to index
    noindex: true
  })
}
