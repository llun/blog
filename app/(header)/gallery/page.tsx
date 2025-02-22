import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getMetadata } from '../../../components/Meta'
import { getConfig } from '../../../libs/blog'
import { getAllAlbums } from '../../../libs/gallery'
import style from './gallery.module.css'

const { url, title, description } = getConfig()

export const metadata: Metadata = getMetadata({
  url,
  title: `${title}, Gallery`,
  description
})

const Gallery = () => {
  const albums = getAllAlbums()
  return (
    <main>
      <h2 className={style.title}>Image Gallery</h2>
      <div className={style.list}>
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
    </main>
  )
}

export default Gallery
