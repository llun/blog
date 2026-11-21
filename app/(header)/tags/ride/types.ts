import { FlagCode } from '@/components/Flag'
import { YoutubeVideo } from '@/components/RideVideos'

export interface CountryData {
  name: string
  // Ride heatmap under public/, also the pages' social image
  image: string
  // Opening paragraph of the map and photos pages; when left out, one is
  // written from the ride stats (see countryIntro in countries.ts)
  intro?: string
  flag: FlagCode
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
