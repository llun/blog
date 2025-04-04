import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { getMetadata } from '../../../components/Meta'
import { getConfig } from '../../../libs/blog'
import { getAllAlbums } from '../../../libs/gallery'

const { url, title, description } = getConfig()

export const metadata: Metadata = getMetadata({
  url,
  title: `${title}, Gallery`,
  description
})

const Gallery = () => {
  const albums = getAllAlbums()
  return (
    <>
      <h2 className="my-2">Image Gallery</h2>
      <div className="gallery-list">
        {albums.map(({ name, image, description, title: albumTitle }) => (
          <Link key={name} href={`/gallery/${name}`}>
            <picture>
              <source
                srcSet={`/gallery/${image.replace('.jpg', '.avif')}`}
                type="image/avif"
              />
              <source
                srcSet={`/gallery/${image.replace('.jpg', '.webp')}`}
                type="image/webp"
              />
              <img
                className="border-none p-0"
                width={512}
                height={512}
                src={`/gallery/${image}`}
                alt={description}
              />
            </picture>
            <h3>{albumTitle}</h3>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Gallery
