import axios from 'axios'
import fs from 'fs/promises'

import { Activity, Country, getCountryStreamPath, Streams } from './constTypes'

export async function getActivities(before?: number, loadAll = false) {
  let page = 1
  const totalPage = loadAll ? 60 : 2
  const all = [] as Activity[]

  while (page < totalPage) {
    const { data } = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAVA_TOKEN}`
        },
        params: {
          page,
          ...(before ? { before } : null)
        }
      }
    )
    all.push(...data)
    page++
    if (data.length === 0) break
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  console.log('Total', all.length)
  return all
}

export async function getLatLngs(country: Country, activity: Activity) {
  await fs.mkdir(getCountryStreamPath(country), { recursive: true })
  const streamFile = `${getCountryStreamPath(country)}/${activity.id}.json`
  try {
    await fs.stat(streamFile)
    const raw = await fs.readFile(streamFile, 'utf8')
    return JSON.parse(raw) as Streams
  } catch {
    const { data } = await axios.get(
      `https://www.strava.com/api/v3/activities/${activity.id}/streams`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAVA_TOKEN}`
        },
        params: {
          keys: 'latlng,altitude,time,heartrate',
          key_by_type: 'true'
        }
      }
    )
    await fs.writeFile(streamFile, JSON.stringify(data), { encoding: 'utf8' })
    return data as Streams
  }
}
