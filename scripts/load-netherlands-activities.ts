#!/usr/bin/env ts-node
import 'dotenv-flow/config'
import axios from 'axios'
import fs from 'fs/promises'

import {
  Activity,
  Country,
  COUNTRY_NETHERLANDS,
  getCountryActivities,
  getCountryStreamPath,
  Streams
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

async function getNetherlandsRides() {
  const activities = await getActivities()
  const netherlandsRides = activities.filter(
    (activity) =>
      activity.sport_type === 'Ride' &&
      [3600, 7200].includes(activity.utc_offset)
  )
  await fs.writeFile(
    `${getCountryActivities(COUNTRY_NETHERLANDS)}`,
    JSON.stringify(netherlandsRides),
    {
      encoding: 'utf8'
    }
  )
  console.log(netherlandsRides.length)
  return netherlandsRides
}

async function getLatLngs(country: Country, activity: Activity) {
  await fs.mkdir(getCountryStreamPath(country), { recursive: true })
  const streamFile = `${getCountryStreamPath(country)}/${activity.id}.json`
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
    await getLatLngs(COUNTRY_NETHERLANDS, activity)
  }
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((e) => console.error(e.message))
