import { Metadata } from 'next'

import {
  AUTHOR_PROFILES,
  PageImage,
  SITE_NAME,
  defaultImage,
  ogLocale,
  pageUrl
} from '../libs/seo'

interface ArticleParams {
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

interface GetMetadataParams {
  // Site origin, e.g. https://www.llun.me
  url: string
  // Site path of the page; the canonical URL keeps the trailing slash. Left
  // out only by the layouts, whose metadata is a fallback for error pages.
  path?: string
  // Full <title>, already in the "<topic> — @แนท" form (see libs/seo.ts)
  title: string
  description: string
  image?: PageImage | null
  article?: ArticleParams
  // Pure listings that duplicate another page stay out of search results
  noindex?: boolean
}

export const getMetadata = ({
  url,
  path,
  title,
  description,
  image,
  article,
  noindex
}: GetMetadataParams): Metadata => {
  const canonical = path === undefined ? undefined : pageUrl(url, path)
  const pageImage = image ?? defaultImage(url, title)
  const images = [
    {
      url: pageImage.url,
      width: pageImage.width,
      height: pageImage.height,
      alt: pageImage.alt
    }
  ]
  return {
    title: { absolute: title },
    description,
    metadataBase: new URL(url),
    ...(noindex ? { robots: { index: false, follow: true } } : null),
    twitter: {
      card: 'summary_large_image',
      site: '@llun',
      title,
      description,
      images: [{ url: pageImage.url, alt: pageImage.alt }]
    },
    openGraph: {
      title,
      description,
      ...(canonical ? { url: canonical } : null),
      siteName: SITE_NAME,
      locale: ogLocale(`${title} ${description}`),
      images,
      ...(article
        ? {
            type: 'article',
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            tags: article.tags
          }
        : { type: 'website' })
    },
    icons: {
      apple: '/img/apple-touch-icon.png',
      shortcut: '/img/favicon.ico',
      icon: [
        { url: '/img/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/img/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
      ]
    },
    manifest: '/site.webmanifest',
    verification: {
      me: [url, ...AUTHOR_PROFILES.filter((profile) => profile.includes('@'))]
    },
    alternates: {
      ...(canonical ? { canonical } : null),
      types: {
        'application/atom+xml': [
          { title: '@llun', url: `${url}/feeds/atom.xml` }
        ],
        'application/json': [{ title: '@llun', url: `${url}/feeds/feed.json` }]
      }
    }
  }
}
