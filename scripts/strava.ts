import axios, { isAxiosError } from 'axios'
import fs from 'fs/promises'

import { Activity, Country, getCountryStreamPath, Streams } from './constTypes'

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_at: number
}

async function refreshAccessToken(): Promise<string> {
  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Strava credentials in environment variables')
  }

  try {
    const { data } = await axios.post<TokenResponse>(
      'https://www.strava.com/oauth/token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }
    )

    // Update .env.local file with new tokens using bash commands
    const envFilePath = '.env.local';
    let envContent = await fs.readFile(envFilePath, 'utf-8');

    envContent = envContent.replace(
      /STRAVA_TOKEN=.*/,
      `STRAVA_TOKEN=${data.access_token}`
    );
    envContent = envContent.replace(
      /STRAVA_REFRESH_TOKEN=.*/,
      `STRAVA_REFRESH_TOKEN=${data.refresh_token}`
    );

    await fs.writeFile(envFilePath, envContent, 'utf-8');

    // Update process.env for current session
    process.env.STRAVA_TOKEN = data.access_token
    process.env.STRAVA_REFRESH_TOKEN = data.refresh_token

    console.log('Access token refreshed successfully')
    return process.env.STRAVA_TOKEN
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 429) {
      const usage = error.response.headers['x-ratelimit-usage']
      const limit = error.response.headers['x-ratelimit-limit']
      console.error(
        `Rate limit hit on refreshing token. Usage: ${usage}, Limit: ${limit}`
      )
    }
    console.error('Failed to refresh access token:', error)
    throw error
  }
}

async function getValidAccessToken(): Promise<string> {
  const currentToken = process.env.STRAVA_TOKEN

  if (!currentToken) {
    throw new Error('No access token found in environment variables')
  }

  try {
    // Test if current token is valid by making a simple API call
    await axios.get('https://www.strava.com/api/v3/athlete', {
      headers: {
        Authorization: `Bearer ${currentToken}`
      }
    })

    return currentToken
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 429) {
        const usage = error.response.headers['x-ratelimit-usage']
        const limit = error.response.headers['x-ratelimit-limit']
        console.error(
          `Rate limit hit on getting athlete. Usage: ${usage}, Limit: ${limit}`
        )
        throw error
      }
    }
    // Token is likely expired, refresh it
    console.log('Access token expired, refreshing...')
    return await refreshAccessToken()
  }
}

export async function getActivities(before?: number, loadAll = false) {
  let page = 1
  const totalPage = loadAll ? 60 : 2
  const all = [] as Activity[]

  const accessToken = await getValidAccessToken()

  while (page < totalPage) {
    try {
      const { data } = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            page,
            per_page: 60,
            ...(before ? { before } : null)
          }
        }
      )
      all.push(...data)
      page++
      if (data.length === 0) break
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 429) {
        const usage = error.response.headers['x-ratelimit-usage']
        const limit = error.response.headers['x-ratelimit-limit']
        console.error(
          `Rate limit hit on getting activities. Usage: ${usage}, Limit: ${limit}`
        )
      }
      throw error
    }
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
    const accessToken = await getValidAccessToken()

    try {
      const { data } = await axios.get(
        `https://www.strava.com/api/v3/activities/${activity.id}/streams`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            keys: 'latlng,altitude,time,heartrate',
            key_by_type: 'true'
          }
        }
      )
      await fs.writeFile(streamFile, JSON.stringify(data), {
        encoding: 'utf8'
      })
      return data as Streams
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 429) {
        const usage = error.response.headers['x-ratelimit-usage']
        const limit = error.response.headers['x-ratelimit-limit']
        console.error(
          `Rate limit hit on getting lat/lng for activity ${activity.id}. Usage: ${usage}, Limit: ${limit}`
        )
      }
      throw error
    }
  }
}
