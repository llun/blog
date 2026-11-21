import { Metadata } from 'next'

import { getMetadata } from '../../../../components/Meta'
import { getConfig } from '../../../../libs/blog'
import { fitDescription, pageTitle, socialImage } from '../../../../libs/seo'
import {
  Crumb,
  breadcrumbList,
  collectionPage,
  graph
} from '../../../../libs/structuredData'
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

export const getCountrySeo = (country: COUNTRY, view: 'map' | 'photos') => {
  const data = COUNTRIES_DATA[country]
  const { url } = getConfig()
  const summary = rideSummary(data)
  const image = socialImage(url, data.image, `Ride heatmap of ${data.name}`)
  if (view === 'map') {
    return {
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
      image,
      noindex: false
    }
  }
  return {
    url,
    path: `/tags/ride/${country}/gallery`,
    title: pageTitle(`${data.name} ride photos`, summary),
    description: fitDescription(
      `Photos taken on my rides in ${data.name}, ${summary}, from a shared iCloud album.`,
      `See the ride map of ${data.name} for every route and the ride posts on @แนท for the stories.`
    ),
    image,
    // The photo grid has no text of its own; the map page is the one to index
    noindex: true
  }
}

export const getCountryMetadata = (
  country: COUNTRY,
  view: 'map' | 'photos'
): Metadata => getMetadata(getCountrySeo(country, view))

// Home > Ride > country (> Photos)
export const getCountryCrumbs = (
  country: COUNTRY,
  view: 'map' | 'photos'
): Crumb[] => [
  { name: 'Home', path: '/' },
  { name: 'Ride', path: '/tags/ride' },
  { name: COUNTRIES_DATA[country].name, path: `/tags/ride/${country}` },
  ...(view === 'photos'
    ? [{ name: 'Photos', path: `/tags/ride/${country}/gallery` }]
    : [])
]

export const getCountryJsonLd = (country: COUNTRY, view: 'map' | 'photos') => {
  const seo = getCountrySeo(country, view)
  return graph(
    collectionPage(seo.url, {
      path: seo.path,
      name: seo.title,
      description: seo.description,
      type: view === 'map' ? 'CollectionPage' : 'ImageGallery',
      image: seo.image,
      about: { '@type': 'Country', name: COUNTRIES_DATA[country].name }
    }),
    breadcrumbList(seo.url, getCountryCrumbs(country, view))
  )
}
