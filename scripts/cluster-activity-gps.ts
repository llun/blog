import clustering from 'density-clustering'
import fs from 'fs/promises'
import path from 'path'

import { LatLng, Streams, STREAM_CACHE_PATH } from './constTypes'

async function run() {
  const files = await fs.readdir(STREAM_CACHE_PATH)
  const dataset: LatLng[] = []
  for (const file of files) {
    const raw = await fs.readFile(`${STREAM_CACHE_PATH}/${file}`, 'utf8')
    const streams = JSON.parse(raw) as Streams
    dataset.push(...streams.latlng.data)
    console.log(
      `Add ${path.basename(file, '.json')}`,
      streams.latlng.data.length,
      dataset.length
    )
  }
  console.log('Total', dataset.length)

  const optics = new clustering.OPTICS()
  const clusters = optics.run(dataset, 2, 2)
  const plot = optics.getReachabilityPlot()
  console.log(clusters, plot)
}

run()
  .then(() => console.log('done'))
  .catch((e) => console.error(e.message))
