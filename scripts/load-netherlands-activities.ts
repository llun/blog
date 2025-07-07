#!/usr/bin/env -S npx tsx
import 'dotenv-flow/config'
import fs from 'fs/promises'

import { COUNTRY_NETHERLANDS, getCountryActivities } from './constTypes'
import { getActivities, getLatLngs } from './strava'
import { isInNetherlands } from './country-utils'

async function getNetherlandsRides() {
  const activities = await getActivities()
  const netherlandsRides = activities.filter((activity) => {
    // Filter for Ride activities
    if (activity.sport_type !== 'Ride') return false

    // Check if activity has valid coordinates
    if (!activity.start_latlng || !activity.end_latlng) return false

    const [startLat, startLng] = activity.start_latlng
    const [endLat, endLng] = activity.end_latlng

    // Include if either start or end is in Netherlands
    return (
      isInNetherlands(startLat, startLng) || isInNetherlands(endLat, endLng)
    )
  })
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
