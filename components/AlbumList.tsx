import Link from 'next/link'
import React from 'react'

import { Album } from '../libs/gallery'
import { isSafeSegment } from '../libs/utils'

const SAFE_IMAGE_FILE = /^[A-Za-z0-9._-]+\.jpg$/i

interface Props {
  albums: Pick<Album, 'name' | 'image' | 'description' | 'title'>[]
  basePath?: string
}

const AlbumList = ({ albums, basePath = '/gallery' }: Props) => (
  <div className="gallery-list">
    {albums.map(({ name, image, description, title }) => {
      if (!isSafeSegment(name) || !SAFE_IMAGE_FILE.test(image)) {
        return null
      }

      const avifImage = image.replace(/\.jpg$/i, '.avif')
      const webpImage = image.replace(/\.jpg$/i, '.webp')
      return (
        <Link key={name} href={`${basePath}/${name}`}>
          <picture>
            <source srcSet={`/gallery/${avifImage}`} type="image/avif" />
            <source srcSet={`/gallery/${webpImage}`} type="image/webp" />
            <img
              className="border-none p-0"
              width={512}
              height={512}
              src={`/gallery/${image}`}
              alt={description}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <h3>{title}</h3>
        </Link>
      )
    })}
  </div>
)

export default AlbumList
