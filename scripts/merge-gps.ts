#!/usr/bin/env ts-node
import fs from 'fs/promises'
import path from 'path'
import { Decimal } from 'decimal.js'
import {
  COUNTRY_NETHERLANDS,
  getCountryStreamPath,
  Streams,
  LatLng
} from './constTypes'

function distance(p1: LatLng, p2: LatLng) {
  const [x1, y1] = p1.map((v) => new Decimal(v))
  const [x2, y2] = p2.map((v) => new Decimal(v))
  return Decimal.sqrt(
    Decimal.pow(x2.minus(x1), new Decimal(2)).plus(
      Decimal.pow(y2.minus(y1), new Decimal(2))
    )
  )
}

function averageDistance(activity: Streams) {
  const data = activity.latlng.data.filter((position, index, array) => {
    if (index < 1) return true
    return distance(position, array[index - 1]).toNumber() > 0
  })

  const totalDistance = data.reduce((sum, coordinate, index, array) => {
    if (index < 1) return sum
    const cur = coordinate
    const prv = array[index - 1]
    return distance(cur, prv).add(sum)
  }, new Decimal(0))
  return totalDistance.div(new Decimal(data.length - 1).toNumber())
}

async function run() {
  const country = COUNTRY_NETHERLANDS
  const streams = (await fs.readdir(getCountryStreamPath(country)))
    .filter((item) => item.endsWith('.json'))
    .map((file) => path.join(getCountryStreamPath(country), file))
    .map((file) => fs.readFile(file, 'utf-8'))
  const activities = (await Promise.all(streams)).map(
    (content) => JSON.parse(content) as Streams
  )
  for (const activity of activities) {
    console.log(averageDistance(activity))
  }
}

run()
  .then(() => console.log('Done'))
  .catch((err) => console.error(err.stack))
