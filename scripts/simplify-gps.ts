#!/usr/bin/env -S npx tsx
import fs from 'fs/promises'
import path from 'path'
import simplifyjs from 'simplify-js'

import {
  Country,
  COUNTRY_NETHERLANDS,
  COUNTRY_SINGAPORE,
  COUNTRY_SLOVENIA,
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

// Calculate distance between two lat/lng points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c * 1000 // Return distance in meters
}

// Remove nearby points within a route to reduce redundancy
function removeNearbyPoints(
  points: { x: number; y: number }[],
  minDistanceMeters: number = 5
): { x: number; y: number }[] {
  if (points.length <= 2) return points

  const filteredPoints: { x: number; y: number }[] = [points[0]] // Always keep the first point

  for (let i = 1; i < points.length - 1; i++) {
    const currentPoint = points[i]
    const lastKeptPoint = filteredPoints[filteredPoints.length - 1]

    // Calculate distance between current point and last kept point
    const distance = calculateDistance(
      lastKeptPoint.y,
      lastKeptPoint.x,
      currentPoint.y,
      currentPoint.x
    )

    // Only keep the point if it's far enough from the last kept point
    if (distance >= minDistanceMeters) {
      filteredPoints.push(currentPoint)
    }
  }

  // Always keep the last point
  if (points.length > 1) {
    filteredPoints.push(points[points.length - 1])
  }

  return filteredPoints
}

async function simplifyCountry(country: Country) {
  const simplifyPath = getCountrySimplifyPath(country)
  await fs.mkdir(simplifyPath, { recursive: true })
  const files = await fs.readdir(getCountryStreamPath(country))

  const features: Feature[] = []
  const processedFiles: string[] = []
  let totalPointsOriginal = 0
  let totalPointsAfterSimplification = 0

  for (const file of files) {
    if (!file.endsWith('.json')) continue

    const raw = await fs.readFile(
      `${getCountryStreamPath(country)}/${file}`,
      'utf8'
    )
    const streams = JSON.parse(raw) as Streams
    // Ignore indoor training
    if (!streams.latlng) continue

    const originalPoints = streams.latlng.data.map((latlng) => ({
      x: latlng[1],
      y: latlng[0]
    }))

    // Apply enhanced simplification (nearby point removal + geometric simplification)
    const nearbyFiltered = removeNearbyPoints(originalPoints, 5) // Remove points within 5 meters
    const finalSimplified = simplifyjs(nearbyFiltered, 0.0001, true) // Moderate tolerance

    totalPointsOriginal += originalPoints.length
    totalPointsAfterSimplification += finalSimplified.length

    console.log(
      `${file}: ${originalPoints.length} → ${nearbyFiltered.length} → ${finalSimplified.length} points`
    )

    await fs.writeFile(
      path.join(simplifyPath, file),
      JSON.stringify(finalSimplified.map((point) => [point.x, point.y]))
    )

    const feature: Feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: finalSimplified.map((point) => [point.x, point.y])
      }
    }
    features.push(feature)
    processedFiles.push(file)
  }

  const geoJson = {
    type: 'FeatureCollection',
    features
  }

  await Promise.all([
    fs.writeFile(
      path.join(simplifyPath, `${country}.json`),
      JSON.stringify(processedFiles.map((item) => path.basename(item, '.json')))
    ),
    fs.writeFile(
      path.join(GEOJSON_PATH, `${country}.json`),
      JSON.stringify(geoJson)
    )
  ])

  console.log('\n=== POINT REDUCTION SUMMARY ===')
  console.log(`Total original points: ${totalPointsOriginal.toLocaleString()}`)
  console.log(
    `After final simplification: ${totalPointsAfterSimplification.toLocaleString()} (${(((totalPointsOriginal - totalPointsAfterSimplification) / totalPointsOriginal) * 100).toFixed(1)}% total reduction)`
  )
  console.log(`Processed ${processedFiles.length} routes`)
}

async function run() {
  await simplifyCountry(COUNTRY_NETHERLANDS)
  // await simplifyCountry(COUNTRY_SINGAPORE)
  await simplifyCountry(COUNTRY_SLOVENIA)
}

run()
  .then(() => console.log('\n=== OPTIMIZATION COMPLETE ==='))
  .catch((e) => {
    console.error(e.message)
    console.error(e.stack)
  })
