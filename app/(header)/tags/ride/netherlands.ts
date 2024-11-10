import { getConfig } from '@/libs/blog'
import { NETHERLANDS_ALBUM_TOKEN } from '@/libs/config'

import rideStats from '../../../../public/tags/ride/stats.json'
import { CountryData } from './types'

const config = getConfig()
const { title, description, url } = config

export const NETHERLANDS: CountryData = {
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
      title: '9 November 2024, Bennekom (NL) to Kleve (D)',
      url: 'https://youtu.be/yUEYRfuwuMM',
      coordinates: [5.980620849645411, 51.78567736248717],
      stravaLink: 'https://www.strava.com/activities/12863375856',
      poster: '/tags/ride/youtube/20241109-ride.jpg'
    },
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
      coordinates: [5.2957564560215795, 51.690566280864395],
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
}
