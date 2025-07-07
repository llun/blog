import rideStats from '../../../../public/tags/ride/stats.json'
import { SLOVENIA_ALBUM_TOKEN } from '../../../../libs/config'
import { getConfig } from '../../../../libs/blog'
import { CountryData } from './types'

const config = getConfig()
const { title, description, url } = config

export const SLOVENIA: CountryData = {
  meta: {
    url,
    title: `${title}, Slovenia`,
    description,
    imageUrl: `${url}/tags/ride/slovenia.png`
  },
  icon: {
    src: '/img/icons/slovenia.png',
    alt: 'Slovenia flag for ride in Slovenia page'
  },
  rideStat: rideStats.slovenia,
  map: {
    zoomLevels: [5.8, 6.2, 6.8],
    minZoom: 5,
    maxZoom: 12,
    center: [14.9955, 46.1512],
    dataPath: '/tags/ride/slovenia.json'
  },
  galleryToken: SLOVENIA_ALBUM_TOKEN,
  youtubes: []
}
