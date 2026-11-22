import fs from 'fs'
import path from 'path'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { getConfig } from '../libs/blog'
import { Album, getAlbum, getAllAlbums } from '../libs/gallery'
import {
  firstParagraph,
  fitDescription,
  monthYear,
  pageTitle,
  socialImage
} from '../libs/seo'
import {
  Crumb,
  birdTaxon,
  breadcrumbList,
  collectionPage,
  graph
} from '../libs/structuredData'
import { getTextLang } from '../libs/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { albumNeighbours } from '../libs/related'
import AlbumList from './AlbumList'
import BirdMap from './BirdMap'
import Breadcrumbs from './Breadcrumbs'
import JsonLd from './JsonLd'
import Medias from './Medias'
import { getMetadata } from './Meta'
import PageHead from './PageHead'
import Pager from './Pager'

// Birds with no GPS in any photo have an empty map file (or none), so they
// get no map. A broken file only hides that bird's map, like parseAlbum.
const hasBirdMap = (name: string) => {
  const file = path.join(process.cwd(), 'public', 'birds', `${name}.json`)
  try {
    const features = JSON.parse(fs.readFileSync(file, 'utf8'))?.features
    return Array.isArray(features) && features.length > 0
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn(`Cannot read bird map ${file}`, error)
    }
    return false
  }
}

// Title, description and social image of an album, shared by the metadata
// and the JSON-LD
const getAlbumSeo = (album: Album, section?: string) => {
  const { url } = getConfig()
  const image = socialImage(url, `gallery/${album.card}`, album.title, {
    width: 1200,
    height: 630
  })
  if (section === 'birds') {
    const species = album.scientificName
      ? `${album.title} (${album.scientificName})`
      : album.title
    return {
      url,
      path: `/birds/${album.name}`,
      title: pageTitle(species, 'Bird photos'),
      description: fitDescription(
        `${species}: my photos, a map of where I saw it and an introduction from Wikipedia.`,
        firstParagraph(album.content)
      ),
      image
    }
  }
  return {
    url,
    path: `/gallery/${album.name}`,
    title: pageTitle(album.title, `Photos, ${monthYear(album.timestamp)}`),
    description: fitDescription(
      album.description,
      firstParagraph(album.content),
      `A photo album from ${monthYear(album.timestamp)} in the @แนท gallery.`
    ),
    image
  }
}

// Home > Gallery (or Birds) > album
const getAlbumCrumbs = (album: Album, section?: string): Crumb[] => [
  { name: 'Home', path: '/' },
  section === 'birds'
    ? { name: 'Birds', path: '/birds' }
    : { name: 'Gallery', path: '/gallery' },
  {
    name: album.title,
    path: `/${section === 'birds' ? 'birds' : 'gallery'}/${album.name}`
  }
]

// Previous and next album, then six more after them (fills 1, 2 or 3 columns), so every album page
// links to its neighbours in the list
const AlbumLinks = ({ album, section }: { album: Album; section?: string }) => {
  const birds = section === 'birds'
  const basePath = birds ? '/birds' : '/gallery'
  const albums = getAllAlbums().filter((other) => other.section === section)
  const sorted = birds
    ? [...albums].sort((first, second) =>
        first.title.localeCompare(second.title)
      )
    : albums
  const { previous, next, more } = albumNeighbours(album, sorted, 6)
  const toLink = (other: Album | null) =>
    other && { href: `${basePath}/${other.name}/`, title: other.title }
  return (
    <>
      <Pager
        label={birds ? 'More birds' : 'More albums'}
        previous={toLink(previous)}
        next={toLink(next)}
        previousLabel={birds ? 'Previous bird' : 'Previous album'}
        nextLabel={birds ? 'Next bird' : 'Next album'}
      />
      {more.length > 0 && (
        <section aria-labelledby="album-more">
          <h2 id="album-more" className="album-section-title">
            {birds ? 'More birds' : 'More albums'}
          </h2>
          <AlbumList albums={more} basePath={basePath} headingLevel={3} />
          <p className="mt-4 mb-0">
            <Link className="key" href={`${basePath}/`}>
              {birds
                ? `All ${albums.length} birds`
                : `All ${albums.length} albums`}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </section>
      )}
    </>
  )
}

const AlbumJsonLd = ({
  album,
  section
}: {
  album: Album
  section?: string
}) => {
  const seo = getAlbumSeo(album, section)
  return (
    <JsonLd
      data={graph(
        collectionPage(seo.url, {
          path: seo.path,
          name: seo.title,
          description: seo.description,
          type: 'ImageGallery',
          image: seo.image,
          ...(section === 'birds' ? { about: birdTaxon(album) } : null)
        }),
        breadcrumbList(seo.url, getAlbumCrumbs(album, section))
      )}
    />
  )
}

interface Props {
  params: Promise<{ name: string }>
}

// Builds the routes for one album page. `section` keeps each album under a
// single URL: plain albums live in /gallery, bird albums in /birds.
export const albumPage = (section?: string) => {
  const getSectionAlbum = async (name: string) => {
    const data = await getAlbum(name)
    return data && data.album.section === section ? data : null
  }

  const generateStaticParams = async () =>
    getAllAlbums()
      .filter((album) => album.section === section)
      .map(({ name }) => ({ name }))

  const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { name } = await params
    const { url } = getConfig()
    const data = await getSectionAlbum(name)
    if (!data) {
      return getMetadata({
        url,
        title: pageTitle('Album not found'),
        description: 'This album does not exist on @แนท.',
        noindex: true
      })
    }

    return getMetadata(getAlbumSeo(data.album, section))
  }

  const Page = async ({ params }: Props) => {
    const { name } = await params
    const data = await getSectionAlbum(name)
    if (!data) notFound()

    const { partition, album, medias } = data
    if (section === 'birds') {
      return (
        <>
          <AlbumJsonLd album={album} section={section} />
          <Breadcrumbs crumbs={getAlbumCrumbs(album, section)} />
          <PageHead
            title={album.title}
            meta={`${medias.length} photos`}
            lang={getTextLang(album.title)}
          />
          <div className="album-sections">
            <div className="bird-detail">
              <img
                className="bird-drawing"
                src={`/gallery/${album.image}`}
                width={512}
                height={512}
                alt={album.description}
              />
              <div className="prose">
                {album.scientificName && (
                  <p className="mt-0 text-muted-foreground italic">
                    {album.scientificName}
                  </p>
                )}
                {album.content && (
                  <div dangerouslySetInnerHTML={{ __html: album.content }} />
                )}
                {album.wikipedia && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    From{' '}
                    <a href={album.wikipedia} rel="noopener noreferrer">
                      Wikipedia
                    </a>
                    , under{' '}
                    <a
                      href="https://creativecommons.org/licenses/by-sa/4.0/"
                      rel="license noopener noreferrer"
                    >
                      CC BY-SA 4.0
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>
            {hasBirdMap(album.name) && (
              <section>
                <h2 className="album-section-title">Where I saw it</h2>
                <BirdMap dataPath={`/birds/${album.name}.json`} />
              </section>
            )}
            <section>
              <h2 className="album-section-title">Photos</h2>
              <Medias
                partition={partition}
                token={album.token}
                medias={medias}
              />
            </section>
            <AlbumLinks album={album} section={section} />
          </div>
        </>
      )
    }
    return (
      <>
        <AlbumJsonLd album={album} section={section} />
        <Breadcrumbs crumbs={getAlbumCrumbs(album, section)} />
        <PageHead
          title={album.title}
          meta={`${medias.length} photos`}
          lang={getTextLang(album.title)}
        />
        <div className="album-sections">
          {album.content && (
            <div
              className="prose text-muted-foreground"
              lang={getTextLang(album.content)}
              dangerouslySetInnerHTML={{ __html: album.content }}
            />
          )}
          <Medias partition={partition} token={album.token} medias={medias} />
          <AlbumLinks album={album} section={section} />
        </div>
      </>
    )
  }

  return { generateStaticParams, generateMetadata, Page }
}
