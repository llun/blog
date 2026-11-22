import { RIDE_COUNTRIES } from '../components/RideNav'
import type { Post } from './blog'
import { postDescendingComparison } from './blog'
import type { Album } from './gallery'

/**
 * Links between pages: related and neighbouring posts, neighbouring albums,
 * and the ride country pages that go with a post.
 */

const normalizeTag = (tag: string) => tag.trim().toLowerCase()

const tagSet = (post: Post) =>
  new Set((post.properties.tags ?? []).map(normalizeTag))

/**
 * Up to `limit` posts that share the most tags with `post`; ties, and posts
 * with no shared tag, are filled by the same category, then by date.
 */
export const relatedPosts = (post: Post, posts: Post[], limit = 4) => {
  const tags = tagSet(post)
  return posts
    .filter((other) => other.file.id !== post.file.id)
    .map((other) => {
      const shared = [...tagSet(other)].filter((tag) => tags.has(tag)).length
      const sameCategory = other.file.category === post.file.category ? 1 : 0
      return {
        other,
        score: shared * 3 + sameCategory,
        distance: Math.abs(other.timestamp - post.timestamp)
      }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.distance - b.distance)
    .slice(0, limit)
    .map(({ other }) => other)
}

/** The posts published just before (older) and after (newer) `post` */
export const adjacentPosts = (post: Post, posts: Post[]) => {
  const sorted = [...posts].sort(postDescendingComparison)
  const index = sorted.findIndex((other) => other.file.id === post.file.id)
  return {
    newer: index > 0 ? sorted[index - 1] : null,
    older: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null
  }
}

/** Ride countries a post is tagged with, e.g. Singapore for a Singapore ride */
export const postCountries = (post: Post) => {
  const tags = tagSet(post)
  return RIDE_COUNTRIES.filter((country) =>
    tags.has(normalizeTag(country.name))
  )
}

/** Posts tagged with a ride country, newest first */
export const countryPosts = (slug: string, posts: Post[]) => {
  const country = RIDE_COUNTRIES.find((item) => item.slug === slug)
  if (!country) return []
  return posts
    .filter((post) => tagSet(post).has(normalizeTag(country.name)))
    .sort(postDescendingComparison)
}

/**
 * Neighbours of an album in a list (alphabetical for birds, newest first for
 * the gallery), wrapping around, and the `more` albums after the next one.
 */
export const albumNeighbours = (album: Album, albums: Album[], more = 4) => {
  const index = albums.findIndex((other) => other.name === album.name)
  if (index < 0 || albums.length < 2) {
    return { previous: null, next: null, more: [] as Album[] }
  }
  const at = (offset: number) =>
    albums[(index + offset + albums.length) % albums.length]
  const previous = at(-1)
  const next = at(1)
  const count = Math.max(0, Math.min(more, albums.length - 3))
  return {
    previous,
    next: next.name === previous.name ? null : next,
    more: Array.from({ length: count }, (_, offset) => at(offset + 2))
  }
}
