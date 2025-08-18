#!/usr/bin/env -S npx tsx
import 'dotenv-flow/config'
import fs from 'fs/promises'
import path from 'path'

import { COUNTRY_SINGAPORE, getCountryActivities, Streams } from './constTypes'
import { getActivities, getLatLngs } from './strava'
import { isSupportedRideType } from './ride-utils'

async function getSingaporeRides() {
  try {
    console.log('Cache found')
    const data = await fs.readFile(
      path.join(__dirname, 'singapore.json'),
      'utf8'
    )
    const rides = JSON.parse(data)
    console.log(rides.length)
    return rides
  } catch {
    console.log('Reload activities')
    const activities = await getActivities(1646814555, true)
    const singaporeRides = activities.filter(
      (activity) =>
        isSupportedRideType(activity) && [28800].includes(activity.utc_offset)
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
}

async function run() {
  const activities = await getSingaporeRides()
  let [notFound, found] = [0, 0]
  for (const activity of activities) {
    try {
      const filePath = path.join(__dirname, 'singapore', `${activity.id}.json`)
      await fs.stat(filePath)
      const data = await fs.readFile(filePath, 'utf8')
      const json = JSON.parse(data) as Streams
      json.id = activity.id
      json.start_time_utc = activity.start_date
      await fs.writeFile(filePath, JSON.stringify(json))
      found++
    } catch {
      notFound++
      console.log('Load activity', activity.id)
      await getLatLngs(COUNTRY_SINGAPORE, activity)
    }
  }
  console.log(found, notFound)
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((e) => console.error(e.message))
