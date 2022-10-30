import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Config, getConfig } from '../../libs/blog'

import Header from '../../components/Header'
import Meta from '../../components/Meta'

import style from './index.module.css'

interface Props {
  config: Config
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
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
        <Link href={'/gallery/apenheul/'}>
          <Image
            src="/gallery/Apenheul.jpg"
            width={512}
            height={512}
            alt="Apenheul gallery image"
          />
          <h3>Apenheul</h3>
        </Link>
        <Link href={'/gallery/keukenhof/'}>
          <Image
            src="/gallery/Keukenhof.jpg"
            width={512}
            height={512}
            alt="Keukenhof gallery image"
          />
          <h3>Keukenhof</h3>
        </Link>
      </div>
    </main>
  </>
)

export default Netherlands
