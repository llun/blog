import { YoutubeVideo } from '@/components/RideVideos'

export interface CountryData {
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
