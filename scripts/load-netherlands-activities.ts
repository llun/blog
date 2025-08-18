#!/usr/bin/env -S npx tsx
import 'dotenv-flow/config'

import { COUNTRY_NETHERLANDS } from './constTypes'
import { isInNetherlands } from './country-utils'
import { getCountryRides, processActivitiesStreams } from './ride-utils'

async function getNetherlandsRides() {
  return await getCountryRides(COUNTRY_NETHERLANDS, isInNetherlands)
}

async function run() {
  const activities = await getNetherlandsRides()
  await processActivitiesStreams(COUNTRY_NETHERLANDS, activities)
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((e) => console.error(e.message))
