#!/usr/bin/env -S npx tsx
import 'dotenv-flow/config'
import fs from 'fs/promises'

import { COUNTRY_SLOVENIA, getCountryActivities } from './constTypes'
import { getActivities, getLatLngs } from './strava'
import { isInSlovenia } from './country-utils'

async function getSloveniaRides() {
  const activities = await getActivities()
  const sloveniaRides = activities.filter((activity) => {
    // Filter for Ride activities
    if (activity.sport_type !== 'Ride') return false

    // Check if activity has valid coordinates
    if (!activity.start_latlng || !activity.end_latlng) return false

    const [startLat, startLng] = activity.start_latlng
    const [endLat, endLng] = activity.end_latlng

    // Include if either start or end is in Slovenia
    return isInSlovenia(startLat, startLng) || isInSlovenia(endLat, endLng)
  })
  await fs.writeFile(
    `${getCountryActivities(COUNTRY_SLOVENIA)}`,
    JSON.stringify(sloveniaRides),
    {
      encoding: 'utf8'
    }
  )
  console.log(sloveniaRides.length)
  return sloveniaRides
}

async function run() {
  const activities = await getSloveniaRides()
  for (const activity of activities) {
    console.log('Load activity', activity.id)
    await getLatLngs(COUNTRY_SLOVENIA, activity)
  }
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((e) => console.error(e.message))
