#!/usr/bin/env ts-node
import 'dotenv-flow/config'
import fs from 'fs/promises'

import { COUNTRY_SINGAPORE, getCountryActivities } from './constTypes'
import { getActivities, getLatLngs } from './strava'

async function getSingaporeRides() {
  const activities = await getActivities(1646814555, true)
  const singaporeRides = activities.filter(
    (activity) =>
      activity.sport_type === 'Ride' && [28800].includes(activity.utc_offset)
  )
  await fs.writeFile(
    `${getCountryActivities(COUNTRY_SINGAPORE)}`,
    JSON.stringify(singaporeRides),
    {
      encoding: 'utf8'
    }
  )
  console.log(singaporeRides.length)
  return singaporeRides
}

async function run() {
  const activities = await getSingaporeRides()
  for (const activity of activities) {
    console.log('Load activity', activity.id)
    await getLatLngs(COUNTRY_SINGAPORE, activity)
  }
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((e) => console.error(e.message))
