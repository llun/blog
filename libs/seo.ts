import { DateTime } from 'luxon'

import { getImage } from './images'
import { getTextLang } from './utils'

export const SITE_NAME = '@แนท'
export const SITE_TAGLINE = 'Life, Ride and Code'
export const AUTHOR_NAME = 'Maythee'
export const AUTHOR_FULL_NAME = 'Maythee Anegboonlap'
// Profiles that are the author's, used for rel=me and JSON-LD sameAs
export const AUTHOR_PROFILES = [
  'https://github.com/llun',
  'https://llun.dev/@null',
  'https://llun.social/@ride'
]

export const DEFAULT_IMAGE = {
  path: '/img/default.png',
  width: 1200,
  height: 630
}

const TITLE_SEPARATOR = ' — '
const TITLE_MIN = 30
const TITLE_MAX = 60
const DESCRIPTION_MIN = 120
const DESCRIPTION_MAX = 160

/**
 * Builds a page URL with the trailing slash every exported page lives under.
 * @param origin - Site origin, e.g. https://www.llun.me
 * @param pathname - Site path, with or without slashes
 */
export const pageUrl = (origin: string, pathname: string) => {
  const segments = pathname
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
  return [origin.replace(/\/+$/, ''), ...segments, ''].join('/')
}

/** Site path (no origin) with a trailing slash, for links and breadcrumbs */
export const pagePath = (pathname: string) => {
  const segments = pathname.split('/').filter((segment) => segment.length > 0)
  return segments.length === 0 ? '/' : `/${segments.join('/')}/`
}

/**
 * "<topic> — @แนท". When that is shorter than 30 characters the extra words
 * (e.g. a category and date) are added before the site name; a topic that is
 * already longer than the 60 character budget keeps its full text and drops
 * the site name instead.
 */
export const pageTitle = (topic: string, extra?: string) => {
  const suffix = `${TITLE_SEPARATOR}${SITE_NAME}`
  let title = `${topic}${suffix}`
  if (title.length < TITLE_MIN && extra) {
    title = `${topic}${TITLE_SEPARATOR}${extra}${suffix}`
  }
  if (title.length > TITLE_MAX && topic.length >= TITLE_MAX - 10) {
    return topic
  }
  return title
}

export const HOME_TITLE = `${SITE_NAME}${TITLE_SEPARATOR}${SITE_TAGLINE}, a personal blog`
export const HOME_DESCRIPTION =
  "Maythee's personal blog about life, cycling and code, mostly in Thai, with ride maps from Singapore, the Netherlands and Slovenia, photo albums and birds."

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()

const endSentence = (text: string) =>
  /[.!?。…)"']$/.test(text) || getTextLang(text.slice(-1)) === 'th'
    ? text
    : `${text}.`

/**
 * Joins description parts until the text reaches 120 characters, then cuts it
 * back to at most 160 at a word break (or anywhere for Thai, which has no
 * spaces between words) with an ellipsis.
 */
export const fitDescription = (...parts: (string | null | undefined)[]) => {
  const cleaned = parts
    .map((part) => normalize(part ?? ''))
    .filter((part) => part.length > 0)
  let text = ''
  for (const part of cleaned) {
    if (text.length >= DESCRIPTION_MIN) break
    text = text ? `${endSentence(text)} ${part}` : part
  }
  if (text.length <= DESCRIPTION_MAX) return text

  const limit = DESCRIPTION_MAX - 1
  const cut = text.slice(0, limit)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed =
    lastSpace >= DESCRIPTION_MIN ? cut.slice(0, lastSpace) : cut.slice(0, limit)
  return `${trimmed.replace(/[\s,;:.-]+$/, '')}…`
}

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

/** Plain text of the first paragraph with words in rendered HTML */
export const firstParagraph = (html?: string | null) => {
  if (!html) return ''
  for (const match of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = normalize(decodeEntities(match[1].replace(/<[^>]+>/g, ' ')))
    if (text.length > 20) return text
  }
  return ''
}

/** First relative image in a markdown body, with its alt text */
export const firstMarkdownImage = (markdown: string) => {
  const match = /!\[([^\]]*)\]\(\s*([^)\s]+)/.exec(markdown)
  if (!match) return null
  const [, alt, src] = match
  if (/^[a-z][a-z0-9+.-]*:/i.test(src) || src.startsWith('/')) return null
  return { alt: normalize(alt), src }
}

export interface PageImage {
  url: string
  width: number
  height: number
  alt: string
}

/**
 * The social card for an image under public/: the 1200 px JPEG copy written by
 * scripts/optimize-images.ts, or the original when there is no copy yet.
 */
export const socialImage = (
  origin: string,
  publicPath: string,
  alt: string,
  fallbackSize?: { width: number; height: number }
): PageImage | null => {
  const entry = getImage(publicPath)
  if (entry) {
    return {
      url: `${origin}${entry.og.src}`,
      width: entry.og.width,
      height: entry.og.height,
      alt
    }
  }
  if (!fallbackSize) return null
  return {
    url: `${origin}/${publicPath.replace(/^\/+/, '')}`,
    ...fallbackSize,
    alt
  }
}

export const defaultImage = (origin: string, alt: string): PageImage => ({
  url: `${origin}${DEFAULT_IMAGE.path}`,
  width: DEFAULT_IMAGE.width,
  height: DEFAULT_IMAGE.height,
  alt
})

/**
 * Language of a page's own text; the Thai site name that appears in most
 * titles and descriptions does not make an English page Thai.
 */
export const pageLang = (text: string) =>
  getTextLang(text.split(SITE_NAME).join(' ')) ?? 'en'

export const ogLocale = (text: string) =>
  pageLang(text) === 'th' ? 'th_TH' : 'en_US'

export const toIsoDate = (timestamp: number) =>
  DateTime.fromMillis(timestamp).toISO() ?? undefined

export const monthYear = (timestamp: number) =>
  DateTime.fromMillis(timestamp).setLocale('en-US').toFormat('LLL yyyy')

export const yearRange = (timestamps: number[]) => {
  const years = timestamps
    .filter((timestamp) => Number.isFinite(timestamp))
    .map((timestamp) => DateTime.fromMillis(timestamp).year)
  if (years.length === 0) return ''
  const first = Math.min(...years)
  const last = Math.max(...years)
  return first === last ? `${first}` : `${first} to ${last}`
}
