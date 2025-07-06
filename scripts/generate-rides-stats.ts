#!/usr/bin/env ts-node

import fs from 'fs/promises'
import path from 'path'
import { Decimal } from 'decimal.js'
import {
  Country,
  COUNTRY_NETHERLANDS,
  COUNTRY_SINGAPORE,
  COUNTRY_SLOVENIA,
  getCountryStreamPath,
  STATS_PATH,
  Streams
} from './constTypes'

async function countryDistanceInKilometers(country: Country) {
  const simplifyPath = getCountryStreamPath(country)
  const files = (await fs.readdir(simplifyPath)).filter((item) =>
    item.endsWith('.json')
  )
  const distances = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(simplifyPath, file)
      const raw = await fs.readFile(fullPath, 'utf-8')
      const streams = JSON.parse(raw) as Streams
      if (!streams.distance) return new Decimal(-1)
      const { data } = streams.distance
      if (!data) return new Decimal(-1)
      const totalDistance = new Decimal(data[data.length - 1])
      return totalDistance
    })
  )
  const totalDistance = distances
    .filter((item) => !item.equals(new Decimal(-1)))
    .reduce((out, distance) => out.add(distance), new Decimal(0))
  return totalDistance.div(new Decimal(1_000)).toNumber()
}

async function totalActivities(country: Country) {
  const simplifyPath = getCountryStreamPath(country)
  const files = (await fs.readdir(simplifyPath)).filter((item) =>
    item.endsWith('.json')
  )
  const activities: number[] = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(simplifyPath, file)
      const raw = await fs.readFile(fullPath, 'utf-8')
      const streams = JSON.parse(raw) as Streams
      if (!streams.distance) return 0
      const { data } = streams.distance
      if (!data) return 0
      return 1
    })
  )
  const totalActivities = activities.reduce(
    (out, activity) => out + activity,
    0
  )
  return totalActivities
}

async function countryStats(country: Country) {
  return {
    distance: await countryDistanceInKilometers(country),
    activities: await totalActivities(country)
  }
}

async function run() {
  const stats = {
    [COUNTRY_SINGAPORE]: await countryStats(COUNTRY_SINGAPORE),
    [COUNTRY_NETHERLANDS]: await countryStats(COUNTRY_NETHERLANDS),
    [COUNTRY_SLOVENIA]: await countryStats(COUNTRY_SLOVENIA)
  }
  console.log(stats)
  await fs.writeFile(STATS_PATH, JSON.stringify(stats))
}

run()
  .then(() => console.log('done'))
  .catch((e) => {
    console.error(e.message)
    console.error(e.stack)
  })
