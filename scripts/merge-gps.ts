#!/usr/bin/env ts-node
import { kdTree } from 'kd-tree-javascript'
import fs from 'fs/promises'
import path from 'path'
import { Decimal } from 'decimal.js'
import {
  COUNTRY_NETHERLANDS,
  getCountryStreamPath,
  Streams
} from './constTypes'

interface Coordinate {
  x: Decimal
  y: Decimal
}

function distance(c1: Coordinate, c2: Coordinate) {
  return Decimal.sqrt(
    Decimal.pow(c2.x.minus(c1.x), new Decimal(2)).plus(
      Decimal.pow(c2.y.minus(c1.y), new Decimal(2))
    )
  ).toNumber()
}

function getLineWithoutDuplicate(activity: Streams) {
  return activity.latlng.data
    .map(([x, y]) => ({ x: new Decimal(y), y: new Decimal(x) } as Coordinate))
    .filter((position, index, array) => {
      if (index < 1) return true
      return distance(position, array[index - 1]) > 0
    })
}

async function writeGeoJson(name: string, points) {
  const feature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: points.map(([x, y]) => [y, x])
    },
    properties: {
      name
    }
  }
  await fs.writeFile(path.join(__dirname, name), JSON.stringify(feature))
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

  const [a1, a2, ...rest] = activities
  writeGeoJson('a1.json', a1.latlng.data)
  writeGeoJson('a2.json', a2.latlng.data)

  const line = getLineWithoutDuplicate(a1)
  for (const p of line) {
    console.log(p)
  }
  const tree = new kdTree(line, distance, ['x', 'y'])

  const l2 = getLineWithoutDuplicate(a2)
  console.log('line2')
  console.log(l2[0])

  console.log('Nearest')
  for (const c of l2) {
    console.log(tree.nearest(c, 1))
  }
}

run()
  .then(() => console.log('Done'))
  .catch((err) => console.error(err.stack))
