import path from 'path'

export type LatLng = [number, number]

export interface Activity {
  athlete: { id: number }
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  sport_type: string
  workout_type: number
  id: number
  start_date: string
  start_date_local: string
  timezone: string
  utc_offset: number
  location_city: string | null
  location_state: string | null
  location_country: string
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  map: {
    id: string
    summary_polyline: string
  }
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  visibility: string
  flagged: boolean
  gear_id: string
  start_latlng: LatLng
  end_latlng: LatLng
  average_speed: number
  max_speed: number
  average_temp: number
  average_watts: number
  kilojoules: number
  device_watts: boolean
  has_heartrate: boolean
  heartrate_opt_out: boolean
  display_hide_heartrate_option: boolean
  elev_high: number
  elev_low: number
  upload_id: number
  upload_id_str: string
  external_id: string
  from_accepted_tag: boolean
  pr_count: number
  total_photo_count: number
  has_kudoed: boolean
}

export interface LatLngStream {
  data: LatLng[]
  series_type: 'distance'
  original_size: number
  resolution: 'low' | 'medium' | 'high'
}

export interface DistanceNumberStream {
  data: number
  series_type: 'distance'
  original_size: number
  resolution: 'low' | 'medium' | 'high'
}

export interface Streams {
  latlng: LatLngStream
  distance: DistanceNumberStream
  altitude: DistanceNumberStream
}

export type Country = 'netherlands' | 'singapore'

export const COUNTRY_NETHERLANDS = 'netherlands'
export const GEOJSON_PATH = path.join(__dirname, '..', 'public', 'tags', 'ride')

export const getCountryStreamPath = (country: Country) =>
  `${__dirname}/${country}`
export const getCountrySimplifyPath = (country: Country) =>
  `${__dirname}/${country}/simplify`
export const getCountryActivities = (country: Country) =>
  `${__dirname}/${country}.json`
