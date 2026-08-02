export const SAFE_ROUTE_SEGMENT = /^[A-Za-z0-9._-]+$/

/**
 * Checks that a value is a single path segment, i.e. it cannot walk out of the
 * directory it gets joined into. Non-ASCII names are allowed, some content
 * files use them.
 * @param value - The value taken from a route parameter or content listing
 * @returns True when the value stays inside its parent directory
 */
export const isSinglePathSegment = (value: string): boolean =>
  value.length > 0 &&
  value !== '.' &&
  value !== '..' &&
  !value.includes('/') &&
  !value.includes('\\') &&
  !value.includes('\0')

/**
 * Stricter variant of isSinglePathSegment that only accepts the plain ASCII
 * names used by routes rendered as static files.
 * @param value - The value taken from a route parameter or content listing
 * @returns True when the value is safe to use as one path segment
 */
export const isSafeSegment = (value: string): boolean =>
  SAFE_ROUTE_SEGMENT.test(value) && isSinglePathSegment(value)
