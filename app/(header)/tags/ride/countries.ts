import { getConfig } from '@/libs/blog'
import { NETHERLANDS_ALBUM_TOKEN, SINGAPORE_ALBUM_TOKEN } from '@/libs/config'
import { YoutubeVideo } from '@/components/RideVideos'

import rideStats from '../../../../public/tags/ride/stats.json'

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
        title: '24 August 2024, Leiden to Amsterdam',
        url: 'https://youtu.be/rkY-xnnCP1A',
        coordinates: [4.48309411917541, 52.165850778039314],
        stravaLink: 'https://www.strava.com/activities/12227225494',
        poster: '/tags/ride/youtube/20240824-ride.jpg'
      },
      {
        title: '18 August 2024, Amstel loop',
        url: 'https://youtu.be/G-hj5IFwgNo',
        coordinates: [5.018490568596654, 52.27357699261753],
        stravaLink: 'https://www.strava.com/activities/12176671832',
        poster: '/tags/ride/youtube/20240818-ride.jpg'
      },
      {
        title: '11 August 2024, Brompton social ride',
        url: 'https://youtu.be/Jl9EEPb-ND0',
        coordinates: [5.045952124862415, 52.30725095800632],
        stravaLink: 'https://www.strava.com/activities/12120093087',
        poster: '/tags/ride/youtube/20240811-ride.jpg'
      },
      {
        title: '10 August 2024, Quick Muiden ride',
        url: 'https://youtu.be/ALWSQy0uKfY',
        coordinates: [4.98490924517493, 52.35172597871807],
        stravaLink: 'https://www.strava.com/activities/12109299754',
        poster: '/tags/ride/youtube/20240810-ride.jpg'
      },
      {
        title: '3 August 2024, Rotterdam - Den Haag and Dune',
        url: 'https://youtu.be/Knsq_lF0Y3c',
        coordinates: [4.4004438045655, 52.21077457877102],
        stravaLink: 'https://www.strava.com/activities/12050553814',
        poster: '/tags/ride/youtube/20240803-ride.jpg'
      },
      {
        title: '27 July 2024, Amsterdam to Lelystad',
        url: 'https://youtu.be/f6x1oGd808I',
        coordinates: [5.122277688637535, 52.376803516202024],
        stravaLink: 'https://www.strava.com/activities/11992534862',
        poster: '/tags/ride/youtube/20240727-ride.jpg'
      },
      {
        title: '20 July 2024, Amsterdam to Den Helder',
        url: 'https://youtu.be/qRiLFjLMJLk',
        coordinates: [4.75410468545544, 52.63208165340734],
        stravaLink: 'https://www.strava.com/activities/11934339901',
        poster: '/tags/ride/youtube/20240720-ride.jpg'
      },
      {
        title: '14 July 2024, Purmerend to Amsterdam',
        url: 'https://youtu.be/hUSs2XPBoMs',
        coordinates: [4.950130637641448, 52.423383560982835],
        stravaLink: 'https://www.strava.com/activities/11887417280',
        poster: '/tags/ride/youtube/20240714-ride2.jpg'
      },
      {
        title: '14 July 2024, Amsterdam to Marken',
        url: 'https://youtu.be/Do7lAt6O5ng',
        coordinates: [5.100470236583325, 52.45748476224982],
        stravaLink: 'https://www.strava.com/activities/11887416526',
        poster: '/tags/ride/youtube/20240714-ride.jpg'
      },
      {
        title: '10 July 2024 ride, Den Bosch to Appeldoorn',
        url: 'https://youtu.be/cknx2SFbc0o',
        coordinates: [5.577499174310558, 51.955453248549496],
        stravaLink: 'https://www.strava.com/activities/11853990929',
        poster: '/tags/ride/youtube/20240710-ride.jpg'
      },
      {
        title: '9 June 2024 ride, Amsterdam to Utrecht',
        url: 'https://youtu.be/r1xC8pEV_b0',
        coordinates: [5.11505091108174, 52.08882279220756],
        stravaLink: 'https://www.strava.com/activities/11611341231',
        poster: '/tags/ride/youtube/20240609-ride.jpg'
      },
      {
        title: '26 May 2024 ride, Eindhoven to Breda',
        url: 'https://youtu.be/Hn4jeAXvIgk',
        coordinates: [5.153654423152908, 51.515585554937815],
        stravaLink: 'https://www.strava.com/activities/11499916773',
        poster: '/tags/ride/youtube/20240526-ride.jpg'
      },
      {
        title: '12 May 2024, Amsterdam to Hoorn',
        url: 'https://youtu.be/xQK4unlnIHg',
        coordinates: [5.051349404293454, 52.64134558426742],
        stravaLink: 'https://www.strava.com/activities/11394487478',
        poster: '/tags/ride/youtube/20240512-ride.jpg'
      },
      {
        title: '11 May 2024, Breda to Middelburg',
        url: 'https://youtu.be/TTeXQkr80sI',
        coordinates: [4.235758189116446, 51.4291230484402],
        stravaLink: 'https://www.strava.com/activities/11384232754',
        poster: '/tags/ride/youtube/20240511-ride.jpg'
      },
      {
        title: '9 March 2024, Middelburg to Rotterdam',
        url: 'https://youtu.be/ODh4cTITV_Y',
        coordinates: [3.858254926463255, 51.76615307633068],
        stravaLink: 'https://www.strava.com/activities/10923238272',
        poster: '/tags/ride/youtube/20240309-ride.jpg'
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
    youtubes: [
      {
        title: '19 January 2019, Mandai loop',
        url: 'https://youtu.be/OBg438lu_NY',
        coordinates: [103.77928208799975, 1.4108291407126594],
        stravaLink: 'https://www.strava.com/activities/2090462749',
        poster: '/tags/ride/youtube/20190120-ride.jpg'
      },
      {
        title: '16 January 2019, Circuit road to Block 71',
        url: 'https://youtu.be/ZCLUXgg3X_o',
        coordinates: [103.85590255773636, 1.2773641414582162],
        stravaLink: 'https://www.strava.com/activities/2081525549',
        poster: '/tags/ride/youtube/20190116-ride.jpg'
      },
      {
        title: '8 December 2018, Changi loop',
        url: 'https://youtu.be/1OPPIgVJVrc',
        coordinates: [104.02311581753212, 1.3361024059127566],
        stravaLink: 'https://www.strava.com/activities/2005566091',
        poster: '/tags/ride/youtube/20181208-ride.jpg'
      },
      {
        title: '2 December 2018, Singapore 100km round island',
        url: 'https://youtu.be/q57N3-i-fcw',
        coordinates: [103.69397260109879, 1.369388816066645],
        stravaLink: 'https://www.strava.com/activities/1995344946',
        poster: '/tags/ride/youtube/20181202-ride.jpg'
      },
      {
        title: '17 November 2018, East-West ride',
        url: 'https://youtu.be/gwd5_NcNlfk',
        coordinates: [103.63723927476568, 1.3413214237097926],
        stravaLink: 'https://www.strava.com/activities/1969704152',
        poster: '/tags/ride/youtube/20181117-ride.jpg'
      },
      {
        title: '10 November 2018, Sentosa loop',
        url: 'https://youtu.be/hDMC7oB5WMI',
        coordinates: [103.82496725449893, 1.2513348952756036],
        stravaLink: 'https://www.strava.com/activities/1955625683',
        poster: '/tags/ride/youtube/20181110-ride.jpg'
      }
    ]
  }
}
