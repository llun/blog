import { getConfig } from '../../../../libs/blog'
import {
  NETHERLANDS_ALBUM_TOKEN,
  SINGAPORE_ALBUM_TOKEN
} from '../../../../libs/config'
import rideStats from '../../../../public/tags/ride/stats.json'

import { YoutubeVideo } from '@/components/RideVideos'

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
  youtubes: YoutubeVideo[]
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
    galleryToken: NETHERLANDS_ALBUM_TOKEN,
    youtubes: [
      {
        title: '3 August 2024, Rotterdam - Den Haag and Dune',
        url: 'https://youtu.be/Knsq_lF0Y3c',
        coordinates: [4.4004438045655, 52.21077457877102]
      },
      {
        title: '27 July 2024, Amsterdam to Lelystad',
        url: 'https://youtu.be/f6x1oGd808I',
        coordinates: [5.122277688637535, 52.376803516202024]
      },
      {
        title: '20 July 2024, Amsterdam to Den Helder',
        url: 'https://youtu.be/qRiLFjLMJLk',
        coordinates: [4.75410468545544, 52.63208165340734]
      },
      {
        title: '14 July 2024, Purmerend to Amsterdam',
        url: 'https://youtu.be/hUSs2XPBoMs',
        coordinates: [4.950130637641448, 52.423383560982835]
      },
      {
        title: '14 July 2024, Amsterdam to Marken',
        url: 'https://youtu.be/Do7lAt6O5ng',
        coordinates: [5.100470236583325, 52.45748476224982]
      },
      {
        title: '10 July 2024 ride, Den Bosch to Appeldoorn',
        url: 'https://youtu.be/cknx2SFbc0o',
        coordinates: [5.577499174310558, 51.955453248549496]
      }
    ]
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
    galleryToken: SINGAPORE_ALBUM_TOKEN,
    youtubes: []
  }
}
