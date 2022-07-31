#!/usr/bin/env ts-node
import fs from 'fs/promises'
import path from 'path'
import simplifyjs from 'simplify-js'

import {
  Country,
  COUNTRY_NETHERLANDS,
  COUNTRY_SINGAPORE,
  GEOJSON_PATH,
  getCountrySimplifyPath,
  getCountryStreamPath,
  LatLng,
  Streams
} from './constTypes'

interface LineStringGeometry {
  type: 'LineString'
  coordinates: LatLng[]
}

interface Feature {
  type: 'Feature'
  geometry: LineStringGeometry
}

async function simplifyCountry(country: Country) {
  const simplifyPath = getCountrySimplifyPath(country)
  await fs.mkdir(simplifyPath, { recursive: true })
  const files = await fs.readdir(getCountryStreamPath(country))
  const features: Feature[] = []
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const raw = await fs.readFile(
      `${getCountryStreamPath(country)}/${file}`,
      'utf8'
    )
    const streams = JSON.parse(raw) as Streams
    // Ignore indoor training
    if (!streams.latlng) continue

    const points = streams.latlng.data.map((latlng) => ({
      x: latlng[1],
      y: latlng[0]
    }))
    const simplifyPoints = simplifyjs(points, 0.00001, true)
    console.log(file, points.length, simplifyPoints.length)
    await fs.writeFile(
      path.join(simplifyPath, file),
      JSON.stringify(simplifyPoints.map((point) => [point.x, point.y]))
    )
    const feature: Feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: simplifyPoints.map((point) => [point.x, point.y])
      }
    }
    features.push(feature)
  }

  const geoJson = {
    type: 'FeatureCollection',
    features
  }

  await Promise.all([
    fs.writeFile(
      path.join(simplifyPath, `${country}.json`),
      JSON.stringify(files.map((item) => path.basename(item, '.json')))
    ),
    fs.writeFile(
      path.join(GEOJSON_PATH, `${country}.json`),
      JSON.stringify(geoJson)
    )
  ])
}

async function run() {
  await simplifyCountry(COUNTRY_NETHERLANDS)
  // await simplifyCountry(COUNTRY_SINGAPORE)
}

run()
  .then(() => console.log('done'))
  .catch((e) => {
    console.error(e.message)
    console.error(e.stack)
  })
