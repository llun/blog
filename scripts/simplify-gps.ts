import fs from 'fs/promises'
import path from 'path'
import simplifyjs from 'simplify-js'

import { LatLng, SIMPLIFY_PATH, Streams, STREAM_CACHE_PATH } from './constTypes'

interface LineStringGeometry {
  type: 'LineString'
  coordinates: LatLng[]
}

interface Feature {
  type: 'Feature'
  geometry: LineStringGeometry
}

async function run() {
  await fs.mkdir(SIMPLIFY_PATH, { recursive: true })
  const files = await fs.readdir(STREAM_CACHE_PATH)
  const features: Feature[] = []
  for (const file of files) {
    const raw = await fs.readFile(`${STREAM_CACHE_PATH}/${file}`, 'utf8')
    const streams = JSON.parse(raw) as Streams
    const points = streams.latlng.data.map((latlng) => ({
      x: latlng[1],
      y: latlng[0]
    }))
    const simplifyPoints = simplifyjs(points, 0.00001, true)
    console.log(points.length, simplifyPoints.length)
    await fs.writeFile(
      path.join(SIMPLIFY_PATH, file),
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
  await fs.writeFile(
    path.join(SIMPLIFY_PATH, 'activities.json'),
    JSON.stringify(files.map((item) => path.basename(item, '.json')))
  )
  await fs.writeFile(
    path.join(SIMPLIFY_PATH, 'geojson.json'),
    JSON.stringify(geoJson)
  )
}

run()
  .then(() => console.log('done'))
  .catch((e) => console.error(e.message))
