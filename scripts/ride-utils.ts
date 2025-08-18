import fs from 'fs/promises'

import {
  Activity,
  Country,
  getCountryActivities,
  SUPPORTED_RIDE_TYPES
} from './constTypes'
import { getActivities, getLatLngs } from './strava'

export interface LocationFilter {
  (lat: number, lng: number): boolean
}

/**
 * Checks if an activity is a supported ride type (Ride or EBikeRide)
 */
export function isSupportedRideType(activity: Activity): boolean {
  return SUPPORTED_RIDE_TYPES.includes(activity.sport_type as any)
}

/**
 * Filters activities for rides within a specific country using location filtering
 */
export function filterCountryRides(
  activities: Activity[],
  locationFilter: LocationFilter
): Activity[] {
  return activities.filter((activity) => {
    // Filter for supported ride types (Ride or EBikeRide)
    if (!isSupportedRideType(activity)) return false

    // Check if activity has valid coordinates
    if (!activity.start_latlng || !activity.end_latlng) return false

    const [startLat, startLng] = activity.start_latlng
    const [endLat, endLng] = activity.end_latlng

    // Include if either start or end is in the target country
    return locationFilter(startLat, startLng) || locationFilter(endLat, endLng)
  })
}

/**
 * Generic function to get country-specific rides with location filtering
 */
export async function getCountryRides(
  country: Country,
  locationFilter: LocationFilter,
  beforeTimestamp?: number,
  loadAll?: boolean
): Promise<Activity[]> {
  const activities = await getActivities(beforeTimestamp, loadAll)
  const countryRides = filterCountryRides(activities, locationFilter)

  await fs.writeFile(
    `${getCountryActivities(country)}`,
    JSON.stringify(countryRides),
    {
      encoding: 'utf8'
    }
  )

  console.log(countryRides.length)
  return countryRides
}

/**
 * Processes activities to load their lat/lng streams
 */
export async function processActivitiesStreams(
  country: Country,
  activities: Activity[]
): Promise<void> {
  for (const activity of activities) {
    console.log('Load activity', activity.id)
    await getLatLngs(country, activity)
  }
}
