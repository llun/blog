import { Metadata } from 'next'
import Head from 'next/head'

type Props = {
  title: string
  description: string
  url: string
  canonical: string
  imageUrl?: string
}

interface GetMetadataParams {
  url: string
  title: string
  description: string
  imageUrl?: string
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

const Meta = ({ title, description, url, canonical, imageUrl }: Props) => (
  <Head>
    <title>{title}</title>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@llun" />
    {!imageUrl && (
      <meta
        property="twitter:image"
        content="https://llun.me/img/default.png"
      />
    )}
    {imageUrl && <meta property="twitter:image" content={imageUrl} />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content="website" />
    {!imageUrl && (
      <meta property="og:image" content="https://llun.me/img/default.png" />
    )}
    {imageUrl && <meta property="og:image" content={imageUrl} />}
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" />
    <link rel="shortcut icon" href="/img/favicon.ico" />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/img/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/img/favicon-16x16.png"
    />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="me" href="https://llun.me" />
    <link
      rel="alternate"
      type="application/atom+xml"
      title="@llun"
      href="https://llun.me/feeds/atom.xml"
    />
    <link
      rel="alternate"
      type="application/rss+xml"
      title="@llun"
      href="https://llun.me/feeds/rss.xml"
    />
    <link
      rel="alternate"
      type="application/json"
      title="@llun"
      href="https://llun.me/feeds/feed.json"
    />
  </Head>
)
export default Meta
