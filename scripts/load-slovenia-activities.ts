#!/usr/bin/env -S npx tsx
import 'dotenv-flow/config'

import { COUNTRY_SLOVENIA } from './constTypes'
import { isInSlovenia } from './country-utils'
import { getCountryRides, processActivitiesStreams } from './ride-utils'

async function getSloveniaRides() {
  return await getCountryRides(COUNTRY_SLOVENIA, isInSlovenia)
}

async function run() {
  const activities = await getSloveniaRides()
  await processActivitiesStreams(COUNTRY_SLOVENIA, activities)
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((e) => console.error(e.message))
