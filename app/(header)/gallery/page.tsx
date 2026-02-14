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
        {albums.map(({ name, image, description, title: albumTitle }) => {
          const encodedName = encodeURIComponent(name)
          const encodedImage = encodeURIComponent(image)
          const encodedAvif = encodeURIComponent(
            image.replace(/\.jpg$/i, '.avif')
          )
          const encodedWebp = encodeURIComponent(
            image.replace(/\.jpg$/i, '.webp')
          )
          return (
            <Link key={name} href={`/gallery/${encodedName}`}>
              <picture>
                <source srcSet={`/gallery/${encodedAvif}`} type="image/avif" />
                <source srcSet={`/gallery/${encodedWebp}`} type="image/webp" />
                <img
                  className="border-none p-0"
                  width={512}
                  height={512}
                  src={`/gallery/${encodedImage}`}
                  alt={description}
                />
              </picture>
              <h3>{albumTitle}</h3>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Gallery
