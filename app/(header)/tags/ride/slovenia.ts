import rideStats from '../../../../public/tags/ride/stats.json'
import { SLOVENIA_ALBUM_TOKEN } from '../../../../libs/config'
import { CountryData } from './types'

export const SLOVENIA: CountryData = {
  name: 'Slovenia',
  image: 'tags/ride/slovenia.png',
  flag: 'SI',
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
