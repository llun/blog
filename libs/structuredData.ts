import type {
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  Graph,
  ImageGallery,
  ImageObject,
  ItemList,
  ListItem,
  Person,
  QuantitativeValue,
  Taxon,
  Thing,
  WebSite
} from 'schema-dts'

import type { Album } from './gallery'
import type { Post } from './blog'
import {
  AUTHOR_FULL_NAME,
  AUTHOR_NAME,
  AUTHOR_PROFILES,
  PageImage,
  SITE_NAME,
  SITE_TAGLINE,
  pageLang,
  pageUrl,
  toIsoDate
} from './seo'
import { getTextLang } from './utils'

/**
 * schema.org JSON-LD for the pages, rendered by components/JsonLd.tsx. Nodes
 * that repeat across pages (the site and its author) use stable @id values so
 * search engines can tie them together. The schema-dts types check every
 * node against the schema.org vocabulary at type-check time.
 */

export interface Crumb {
  name: string
  // Site path; the canonical URL with its trailing slash is built from it
  path: string
}

// schema.org sizes are QuantitativeValues; E37 is the UN/CEFACT code for pixel
const pixels = (value: number): QuantitativeValue => ({
  '@type': 'QuantitativeValue',
  value,
  unitCode: 'E37'
})

const imageObject = (image: PageImage): ImageObject => ({
  '@type': 'ImageObject',
  url: image.url,
  contentUrl: image.url,
  width: pixels(image.width),
  height: pixels(image.height),
  caption: image.alt
})

const itemList = (
  origin: string,
  items: { name: string; path: string }[]
): ItemList => ({
  '@type': 'ItemList',
  numberOfItems: items.length,
  itemListElement: items.map((item, index): ListItem => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: pageUrl(origin, item.path)
  }))
})

const personId = (origin: string) => `${origin}/#person`
const websiteId = (origin: string) => `${origin}/#website`

export const personNode = (origin: string): Person => ({
  '@type': 'Person',
  '@id': personId(origin),
  name: AUTHOR_NAME,
  alternateName: AUTHOR_FULL_NAME,
  url: `${origin}/`,
  image: `${origin}/img/logo.png`,
  sameAs: AUTHOR_PROFILES
})

export const websiteNode = (origin: string): WebSite => ({
  '@type': 'WebSite',
  '@id': websiteId(origin),
  url: `${origin}/`,
  name: SITE_NAME,
  description: SITE_TAGLINE,
  inLanguage: ['th', 'en'],
  author: { '@id': personId(origin) },
  publisher: { '@id': personId(origin) }
})

export const breadcrumbList = (
  origin: string,
  crumbs: Crumb[]
): BreadcrumbList => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: pageUrl(origin, crumb.path)
  }))
})

/** Wraps nodes in one @graph document */
export const graph = (...nodes: Thing[]): Graph => ({
  '@context': 'https://schema.org',
  '@graph': nodes
})

export const blogPosting = (
  origin: string,
  post: Post,
  description: string,
  image: PageImage
): BlogPosting => {
  const url = pageUrl(origin, `/posts/${post.file.id}`)
  const { properties } = post
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: properties.title,
    description,
    datePublished: toIsoDate(post.timestamp),
    dateModified: toIsoDate(post.modifiedTimestamp),
    author: { '@id': personId(origin) },
    publisher: { '@id': personId(origin) },
    image: imageObject(image),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    isPartOf: { '@id': websiteId(origin) },
    keywords: properties.tags ?? [],
    inLanguage:
      properties.lang ??
      getTextLang(
        `${properties.title} ${(post.content ?? '').slice(0, 4000)}`
      ) ??
      'en'
  }
}

interface CollectionParams {
  path: string
  name: string
  description: string
  // ImageGallery for one album, CollectionPage for lists of posts or albums
  type?: 'CollectionPage' | 'ImageGallery'
  image?: PageImage | null
  // Pages listed on the collection, in order
  items?: { name: string; path: string }[]
  about?: Thing
}

export const collectionPage = (
  origin: string,
  { path, name, description, type, image, items, about }: CollectionParams
): CollectionPage | ImageGallery => {
  const page = {
    '@id': `${pageUrl(origin, path)}#page`,
    url: pageUrl(origin, path),
    name,
    description,
    isPartOf: { '@id': websiteId(origin) },
    author: { '@id': personId(origin) },
    inLanguage: pageLang(`${name} ${description}`),
    ...(image
      ? {
          primaryImageOfPage: imageObject(image)
        }
      : null),
    ...(about ? { about } : null),
    ...(items && items.length > 0
      ? {
          mainEntity: itemList(origin, items)
        }
      : null)
  }
  return type === 'ImageGallery'
    ? { '@type': 'ImageGallery', ...page }
    : { '@type': 'CollectionPage', ...page }
}

/** The bird a species page is about, as a schema.org Taxon */
export const birdTaxon = (album: Album): Taxon => ({
  '@type': 'Taxon',
  name: album.scientificName ?? album.title,
  alternateName: album.title,
  taxonRank: 'species',
  ...(album.wikipedia ? { sameAs: album.wikipedia } : null)
})
