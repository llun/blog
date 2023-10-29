import { Metadata } from 'next'
import React from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { getMetadata } from '../../components/Meta'
import { getConfig } from '../../libs/blog'
import { getAllAlbums } from '../../libs/gallery'
import style from './gallery.module.css'

export const metadata: Metadata = getMetadata({
  title: `${getConfig().title}, Gallery`,
  description: getConfig().description
})

const Gallery = () => {
  const albums = getAllAlbums()
  return (
    <main>
      <h2 className={style.title}>Image Gallery</h2>
      <div className={style.list}>
        {albums.map(({ name, image, description, title }) => (
          <Link key={name} href={`/gallery/${name}`}>
            <Image
              src={`/gallery/${image}`}
              width={512}
              height={512}
              alt={description}
            />
            <h3>{title}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Gallery
