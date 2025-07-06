#!/usr/bin/env ts-node
import 'dotenv-flow/config'
import fs from 'fs/promises'

import { COUNTRY_SLOVENIA, getCountryActivities } from './constTypes'
import { getActivities, getLatLngs } from './strava'

// Slovenia geographic bounds
const SLOVENIA_BOUNDS = {
  minLat: 45.4, // Southern border
  maxLat: 46.9, // Northern border
  minLng: 13.4, // Western border
  maxLng: 16.6 // Eastern border
}

// Check if coordinates are within Slovenia bounds
function isInSlovenia(lat: number, lng: number): boolean {
  return (
    lat >= SLOVENIA_BOUNDS.minLat &&
    lat <= SLOVENIA_BOUNDS.maxLat &&
    lng >= SLOVENIA_BOUNDS.minLng &&
    lng <= SLOVENIA_BOUNDS.maxLng
  )
}

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
