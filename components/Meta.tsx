import Head from 'next/head'

type Props = {
  title: string
  description: string
  url: string
  imageUrl?: string
}

const Meta = ({ title, description, url, imageUrl }: Props) => (
  <Head>
    <title>{title}</title>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@llun" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content="website" />
    {imageUrl && <meta property="og:image" content={imageUrl} />}
    <meta name="description" content={description} />
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
  </Head>
)
export default Meta
