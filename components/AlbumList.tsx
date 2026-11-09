import { DateTime } from 'luxon'
import Link from 'next/link'
import React from 'react'

import { Album } from '../libs/gallery'
import { getTextLang, isSafeSegment } from '../libs/utils'

const SAFE_IMAGE_FILE = /^[A-Za-z0-9._-]+\.jpg$/i

interface Props {
  albums: Pick<
    Album,
    'name' | 'image' | 'description' | 'title' | 'timestamp' | 'scientificName'
  >[]
  basePath?: string
}

const AlbumList = ({ albums, basePath = '/gallery' }: Props) => (
  <div className="gallery-list">
    {albums.map(
      ({ name, image, description, title, timestamp, scientificName }) => {
        if (!isSafeSegment(name) || !SAFE_IMAGE_FILE.test(image)) {
          return null
        }

        const avifImage = image.replace(/\.jpg$/i, '.avif')
        const webpImage = image.replace(/\.jpg$/i, '.webp')
        return (
          <Link
            key={name}
            href={`${basePath}/${name}`}
            className="gallery-card"
          >
            <picture>
              <source srcSet={`/gallery/${avifImage}`} type="image/avif" />
              <source srcSet={`/gallery/${webpImage}`} type="image/webp" />
              <img
                className="gallery-card-image"
                width={512}
                height={512}
                src={`/gallery/${image}`}
                alt={description}
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="gallery-card-caption">
              <h2 className="gallery-card-title" lang={getTextLang(title)}>
                {title}
              </h2>
              <span className="gallery-card-meta">
                {scientificName ??
                  DateTime.fromMillis(timestamp)
                    .setLocale('en-US')
                    .toFormat('LLL yyyy')}
              </span>
            </div>
          </Link>
        )
      }
    )}
  </div>
)

export default AlbumList
