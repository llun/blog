import { getConfig } from '../../../libs/blog'
import {
  NETHERLANDS_ALBUM_TOKEN,
  SINGAPORE_ALBUM_TOKEN
} from '../../../libs/config'
import rideStats from '../../../public/tags/ride/stats.json'

const config = getConfig()
const { title, description, url } = config

export enum COUNTRY {
  NETHERLANDS = 'netherlands',
  SINGAPORE = 'singapore'
}

interface CountryData {
  meta: {
    url: string
    title: string
    description: string
    imageUrl: string
  }
  icon: {
    src: string
    alt: string
  }
  rideStat: { distance: number; activities: number }
  map: {
    zoomLevels: [number, number, number]
    minZoom: number
    maxZoom: number
    center: [number, number]
    dataPath: string
  }
  galleryToken: string
}

export const COUNTRIES_DATA: Record<COUNTRY, CountryData> = {
  [COUNTRY.NETHERLANDS]: {
    meta: {
      url,
      title: `${title}, Netherlands`,
      description,
      imageUrl: `${url}/tags/ride/netherlands.png`
    },
    icon: {
      src: '/img/icons/netherlands.png',
      alt: 'The Netherlands flag for ride in the Netherlands page'
    },
    rideStat: rideStats.netherlands,
    map: {
      zoomLevels: [5.7, 6.0, 6.6],
      minZoom: 5,
      maxZoom: 12,
      center: [5.12548838940261, 51.98430524939225],
      dataPath: '/tags/ride/netherlands.json'
    },
    galleryToken: NETHERLANDS_ALBUM_TOKEN
  },
  [COUNTRY.SINGAPORE]: {
    meta: {
      url,
      title: `${title}, Singapore`,
      description,
      imageUrl: `${url}/tags/ride/singapore.png`
    },
    icon: {
      src: '/img/icons/singapore.png',
      alt: 'Singapore flag for ride in Singapore page'
    },
    rideStat: rideStats.singapore,
    map: {
      zoomLevels: [8, 9, 10.4],
      minZoom: 8,
      maxZoom: 12,
      center: [103.81561802376315, 1.3498842996482667],
      dataPath: '/tags/ride/singapore.json'
    },
    galleryToken: SINGAPORE_ALBUM_TOKEN
  }
}
