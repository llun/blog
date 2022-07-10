import 'dotenv-flow/config'
import axios from 'axios'
import fs from 'fs/promises'

type LatLng = [number, number]

interface Activity {
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

interface LatLngStream {
  data: LatLng[]
  series_type: 'distance'
  original_size: number
  resolution: 'low' | 'medium' | 'high'
}

interface DistanceNumberStream {
  data: number
  series_type: 'distance'
  original_size: number
  resolution: 'low' | 'medium' | 'high'
}

const ACTIVITIES_CACHE_PATH = `${__dirname}/activities.json`
const STREAM_CACHE_PATH = `${__dirname}/streams`

async function getActivities() {
  const { data } = await axios.get(
    'https://www.strava.com/api/v3/athlete/activities',
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAVA_TOKEN}`
      }
    }
  )
  return data as Activity[]
}

async function isActivitiesExists() {
  try {
    await fs.stat(ACTIVITIES_CACHE_PATH)
    return true
  } catch {
    return false
  }
}

async function getNetherlandsRides() {
  if (await isActivitiesExists()) {
    const raw = await fs.readFile(ACTIVITIES_CACHE_PATH, 'utf-8')
    return JSON.parse(raw) as Activity[]
  }

  const activities = await getActivities()
  const netherlandsRides = activities.filter(
    (activity) =>
      activity.sport_type === 'Ride' &&
      [3600, 7200].includes(activity.utc_offset)
  )
  await fs.writeFile(
    `${__dirname}/activities.json`,
    JSON.stringify(netherlandsRides),
    { encoding: 'utf8' }
  )
  console.log(netherlandsRides.length)
  return netherlandsRides
}

async function getLatLngs(activity: Activity) {
  await fs.mkdir(STREAM_CACHE_PATH, { recursive: true })
  const streamFile = `${STREAM_CACHE_PATH}/${activity.id}.json`
  try {
    await fs.stat(streamFile)
    const raw = await fs.readFile(streamFile, 'utf8')
    return JSON.parse(raw) as {
      latlng: LatLngStream
      distance: DistanceNumberStream
      altitude: DistanceNumberStream
    }
  } catch {
    const { data } = await axios.get(
      `https://www.strava.com/api/v3/activities/${activity.id}/streams?keys=latlng,distance,altitude&key_by_type=true`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAVA_TOKEN}`
        }
      }
    )
    await fs.writeFile(streamFile, JSON.stringify(data), { encoding: 'utf8' })
    return data as {
      latlng: LatLngStream
      distance: DistanceNumberStream
      altitude: DistanceNumberStream
    }
  }
}

async function run() {
  const activities = await getNetherlandsRides()
  for (const activity of activities) {
    console.log('Load activity', activity.id)
    await getLatLngs(activity)
  }
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((e) => console.error(e.message))
