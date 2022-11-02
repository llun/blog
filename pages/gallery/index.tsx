import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Config, getConfig } from '../../libs/blog'

import Header from '../../components/Header'
import Meta from '../../components/Meta'

import style from './index.module.css'
import {
  APENHEUL_ALBUM_TOKEN,
  AVIODROME_ALBUM_TOKEN,
  BELGIË_ALBUM_TOKEN,
  KEUKENHOF_ALBUM_TOKEN,
  TEXEL_DENHELDER_2022_ALBUM_TOKEN
} from '../../libs/config'

interface Props {
  config: Config
}

export interface Gallery {
  name: string
  image: string
  card: string
  title: string
  description: string
  token: string
}

export const Galleries: Gallery[] = [
  {
    name: 'apenheul',
    image: 'Apenheul.jpg',
    card: 'Apenheul.card.jpg',
    title: 'Apenheul',
    description: 'Apenheul zoo visited on October 2022',
    token: APENHEUL_ALBUM_TOKEN
  },
  {
    name: 'aviodrome',
    image: 'Aviodrome.jpg',
    card: 'Aviodrome.card.jpg',
    title: 'Aviodrome',
    description: 'Aviation museum near Lelystad',
    token: AVIODROME_ALBUM_TOKEN
  },
  {
    name: 'belgië2022',
    image: 'Belgium2022.jpg',
    card: 'Belgium2022.card.jpg',
    title: 'België 2022',
    description: 'Belgium visited in 2022 both by bike and by tour',
    token: BELGIË_ALBUM_TOKEN
  },
  {
    name: 'texel-denheler2022',
    image: 'TexelDenHelder2022.jpg',
    card: 'TexelDenHelder2022.card.jpg',
    title: 'Texel and Den Helder 2022',
    description:
      'Trips to the north of Netherlands, Texel and Den Helder. By bike & train.',
    token: TEXEL_DENHELDER_2022_ALBUM_TOKEN
  },
  {
    name: 'keukenhof',
    image: 'Keukenhof.jpg',
    card: 'Keukenhof.card.jpg',
    title: 'Keukenhof',
    description: 'Keukenhof visited on 2022',
    token: KEUKENHOF_ALBUM_TOKEN
  }
]

export const getStaticProps: GetStaticProps<Props> = async () => {
  const config = getConfig()

  return {
    props: {
      config
    }
  }
}

const Netherlands: NextPage<Props> = ({ config }) => (
  <>
    <Meta
      title={`${config.title}, Gallery`}
      description={config.description}
      url={`${config.url}/gallery`}
    />
    <Header title={config.title} url={config.url} />
    <main>
      <h2>Image Gallery</h2>
      <div className={style.list}>
        {Galleries.map(({ name, title, image, description }) => (
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
