import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { getConfig } from '../libs/blog'
import { getAlbum, getAllAlbums } from '../libs/gallery'
import { getTextLang } from '../libs/utils'
import BirdMap from './BirdMap'
import Medias from './Medias'
import { getMetadata } from './Meta'
import PageHead from './PageHead'

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
    const { title, description, url } = getConfig()
    const data = await getSectionAlbum(name)
    if (!data) {
      return getMetadata({ url, title, description })
    }

    const { album } = data
    return getMetadata({
      url,
      title: `${title}, ${album.title}`,
      description: album.description,
      imageUrl: `${url}/gallery/${album.card}`
    })
  }

  const Page = async ({ params }: Props) => {
    const { name } = await params
    const data = await getSectionAlbum(name)
    if (!data) notFound()

    const { partition, album, medias } = data
    if (section === 'birds') {
      return (
        <>
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
            <section>
              <h2 className="album-section-title">Where I saw it</h2>
              <BirdMap dataPath={`/birds/${album.name}.json`} />
            </section>
            <section>
              <h2 className="album-section-title">Photos</h2>
              <Medias
                partition={partition}
                token={album.token}
                medias={medias}
              />
            </section>
          </div>
        </>
      )
    }
    return (
      <>
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
        </div>
      </>
    )
  }

  return { generateStaticParams, generateMetadata, Page }
}
