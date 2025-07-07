// Country boundary utilities for geographic filtering

export interface CountryBounds {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

export const COUNTRY_BOUNDS: Record<string, CountryBounds> = {
  NETHERLANDS: {
    minLat: 50.75, // Southern border
    maxLat: 53.7, // Northern border
    minLng: 3.2, // Western border
    maxLng: 7.2 // Eastern border
  },
  SLOVENIA: {
    minLat: 45.4, // Southern border
    maxLat: 46.9, // Northern border
    minLng: 13.4, // Western border
    maxLng: 16.6 // Eastern border
  }
}

export function isInCountryBounds(
  lat: number,
  lng: number,
  bounds: CountryBounds
): boolean {
  return (
    lat >= bounds.minLat &&
    lat <= bounds.maxLat &&
    lng >= bounds.minLng &&
    lng <= bounds.maxLng
  )
}

export function isInNetherlands(lat: number, lng: number): boolean {
  return isInCountryBounds(lat, lng, COUNTRY_BOUNDS.NETHERLANDS)
}

export function isInSlovenia(lat: number, lng: number): boolean {
  return isInCountryBounds(lat, lng, COUNTRY_BOUNDS.SLOVENIA)
}