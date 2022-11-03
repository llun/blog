import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Config, getConfig } from '../../libs/blog'
import { Album, getAllAlbums } from '../../libs/gallery'

import Header from '../../components/Header'
import Meta from '../../components/Meta'

import style from './index.module.css'

interface Props {
  config: Config
  albums: Album[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const config = getConfig()
  const albums = getAllAlbums()
  return {
    props: {
      config,
      albums
    }
  }
}

const Netherlands: NextPage<Props> = ({ config, albums }) => (
  <>
    <Meta
      title={`${config.title}, Gallery`}
      description={config.description}
      url={`${config.url}/gallery`}
    />
    <Header title={config.title} url={config.url} />
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
  </>
)

export default Netherlands
