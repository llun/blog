import { Metadata } from 'next'

interface GetMetadataParams {
  url: string
  title: string
  description: string
  imageUrl?: string | null
}
export const getMetadata = ({
  url,
  title,
  description,
  imageUrl
}: GetMetadataParams): Metadata => {
  const defaultImageUrl = 'https://llun.me/img/default.png'
  return {
    title,
    description,
    metadataBase: new URL(url),
    twitter: {
      card: 'summary_large_image',
      site: '@llun',
      images: imageUrl || defaultImageUrl
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: imageUrl || defaultImageUrl
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
      me: ['https://llun.me', 'https://llun.dev/@null']
    },
    alternates: {
      types: {
        'application/atom+xml': [
          { title: '@llun', url: 'https://llun.me/feeds/atom.xml' }
        ],
        'application/rss+xml': [
          { title: '@llun', url: 'https://llun.me/feeds/rss.xml' }
        ],
        'application/json': [
          { title: '@llun', url: 'https://llun.me/feeds/feed.json' }
        ]
      }
    }
  }
}
