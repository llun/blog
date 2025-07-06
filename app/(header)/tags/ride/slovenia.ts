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
  rideStat: { distance: 0, activities: 0 },
  map: {
    zoomLevels: [7.0, 8.0, 9.0],
    minZoom: 6,
    maxZoom: 12,
    center: [14.9955, 46.1512],
    dataPath: '/tags/ride/slovenia.json'
  },
  galleryToken: '',
  youtubes: []
}
