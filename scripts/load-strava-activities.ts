import 'dotenv-flow/config'
import axios from 'axios'
import fs from 'fs/promises'

import {
  ACTIVITIES_CACHE_PATH,
  Activity,
  Streams,
  STREAM_CACHE_PATH
} from './constTypes'

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
    return JSON.parse(raw) as Streams
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
    return data as Streams
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
