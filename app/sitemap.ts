import type { MetadataRoute } from 'next'

import { getAllCalendars } from '../libs/amsterdam'
import { getAllPosts, getConfig } from '../libs/blog'
import { getAllAlbums } from '../libs/gallery'
import { getAllJourneys } from '../libs/journey'
import { generateStaticParams as generateTagParams } from './(header)/tags/[tag]/page'
import { COUNTRY } from './(header)/tags/ride/countries'

// Required by output: 'export' — without it the build refuses to collect this
// route because it cannot prove the sitemap is generated at build time
export const dynamic = 'force-static'

type SitemapEntry = MetadataRoute.Sitemap[number]

// trailingSlash is enabled, so every exported page lives at <path>/index.html
// and its canonical url has to keep the trailing slash.
const pageUrl = (origin: string, pathname: string) => {
  const segments = pathname
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
  return [origin, ...segments, ''].join('/')
}

const lastModified = (timestamp: number) =>
  Number.isFinite(timestamp) ? new Date(timestamp) : undefined

const newestTimestamp = (timestamps: number[]) => {
  const valid = timestamps.filter((timestamp) => Number.isFinite(timestamp))
  if (valid.length === 0) return Number.NaN
  return valid.reduce((newest, timestamp) =>
    timestamp > newest ? timestamp : newest
  )
}

const dedupe = (entries: SitemapEntry[]) => {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const origin = getConfig().url.replace(/\/+$/, '')
  const url = (pathname: string) => pageUrl(origin, pathname)

  const posts = getAllPosts()
  const albums = getAllAlbums()
  const journeys = getAllJourneys()
  const [calendars, tags] = await Promise.all([
    getAllCalendars(),
    generateTagParams()
  ])

  const categoryTimestamp = (category: string) =>
    newestTimestamp(
      posts
        .filter((post) => post.file.category === category)
        .map((post) => post.timestamp)
    )

  const latestPost = newestTimestamp(posts.map((post) => post.timestamp))
  const latestAlbum = newestTimestamp(albums.map((album) => album.timestamp))

  return dedupe([
    {
      url: url('/'),
      lastModified: lastModified(latestPost),
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: url('/posts'),
      lastModified: lastModified(latestPost),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: url('/gallery'),
      lastModified: lastModified(latestAlbum),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: url('/journeys'),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: url('/tags/ride'),
      lastModified: lastModified(categoryTimestamp('ride')),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    ...tags.map(
      ({ tag }): SitemapEntry => ({
        url: url(`/tags/${tag}`),
        lastModified: lastModified(categoryTimestamp(tag)),
        changeFrequency: 'weekly',
        priority: 0.8
      })
    ),
    ...Object.values(COUNTRY).flatMap((country): SitemapEntry[] => [
      {
        url: url(`/tags/ride/${country}`),
        changeFrequency: 'monthly',
        priority: 0.7
      },
      {
        url: url(`/tags/ride/${country}/gallery`),
        changeFrequency: 'monthly',
        priority: 0.5
      }
    ]),
    ...posts.map(
      (post): SitemapEntry => ({
        url: url(`/posts/${post.file.id}`),
        lastModified: lastModified(post.timestamp),
        changeFrequency: 'yearly',
        priority: 0.7
      })
    ),
    ...albums.map(
      (album): SitemapEntry => ({
        url: url(`/gallery/${album.name}`),
        lastModified: lastModified(album.timestamp),
        changeFrequency: 'yearly',
        priority: 0.6
      })
    ),
    ...journeys.map(
      (journey): SitemapEntry => ({
        url: url(`/journeys/${journey.name}`),
        changeFrequency: 'monthly',
        priority: 0.6
      })
    ),
    ...calendars.map(
      (calendar): SitemapEntry => ({
        url: url(`/journeys/amsterdam/${calendar.id}`),
        changeFrequency: 'yearly',
        priority: 0.4
      })
    )
  ])
}

export default sitemap
