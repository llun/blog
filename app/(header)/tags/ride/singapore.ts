import rideStats from '../../../../public/tags/ride/stats.json'
import { getConfig } from '../../../../libs/blog'
import { SINGAPORE_ALBUM_TOKEN } from '../../../../libs/config'
import { CountryData } from './types'

const config = getConfig()
const { title, description, url } = config
export const SINGAPORE: CountryData = {
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
