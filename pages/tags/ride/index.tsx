import React, { FC } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'

import { Config, getConfig } from '../../../libs/blog'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'

import style from './index.module.css'
import 'mapbox-gl/dist/mapbox-gl.css'

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const config = getConfig()
  return {
    props: {
      config,
      category: 'ride'
    }
  }
}

interface Props {
  config: Config
  category: string
}

export const Navigation: FC = () => (
  <section className={style.navigation}>
    <Link href={'/tags/ride/posts'}>
      <a className={style.item} aria-label="Link to post list">
        Posts
      </a>
    </Link>
    <Link href={'/tags/ride/netherlands'}>
      <a className={style.item} aria-label="Link to Netherlands cycling map">
        Netherlands
      </a>
    </Link>
  </section>
)

const Index: NextPage<Props> = ({ config, category }) => {
  const { title, description, url } = config
  const pageTitle = [category[0].toLocaleUpperCase(), category.slice(1)].join(
    ''
  )

  return (
    <>
      <Meta
        title={`${title}, ${category}`}
        description={description}
        url={url}
        imageUrl={`${url}/tags/ride/map.png?${Date.now()}`}
      />
      <Header title={title} url={url} />
      <main>
        <h1>{pageTitle}</h1>
        <Navigation />
      </main>
    </>
  )
}
export default Index
