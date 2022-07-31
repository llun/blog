#!/usr/bin/env ts-node
import 'dotenv-flow/config'
import fs from 'fs/promises'

import { COUNTRY_NETHERLANDS, getCountryActivities } from './constTypes'
import { getActivities, getLatLngs } from './strava'

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
