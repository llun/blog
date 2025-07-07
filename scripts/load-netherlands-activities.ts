#!/usr/bin/env ts-node
import 'dotenv-flow/config'
import fs from 'fs/promises'

import { COUNTRY_NETHERLANDS, getCountryActivities } from './constTypes'
import { getActivities, getLatLngs } from './strava'

// Netherlands geographic bounds
const NETHERLANDS_BOUNDS = {
  minLat: 50.75, // Southern border
  maxLat: 53.7, // Northern border
  minLng: 3.2, // Western border
  maxLng: 7.2 // Eastern border
}

// Check if coordinates are within Netherlands bounds
function isInNetherlands(lat: number, lng: number): boolean {
  return (
    lat >= NETHERLANDS_BOUNDS.minLat &&
    lat <= NETHERLANDS_BOUNDS.maxLat &&
    lng >= NETHERLANDS_BOUNDS.minLng &&
    lng <= NETHERLANDS_BOUNDS.maxLng
  )
}

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
