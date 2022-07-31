import React, { FC } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'

import {
  Config,
  getAllPosts,
  getConfig,
  Post,
  postDescendingComparison
} from '../../../libs/blog'
import Header from '../../../components/Header'
import Meta from '../../../components/Meta'

import style from './index.module.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import PostList from '../../../components/PostList'

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const config = getConfig()
  const posts = getAllPosts()
    .filter((post) => post.file.category === 'ride')
    .sort(postDescendingComparison)
  return {
    props: {
      posts,
      config,
      category: 'ride'
    }
  }
}

interface Props {
  posts: Post[]
  config: Config
  category: string
}

export const Navigation: FC = () => (
  <section className={style.navigation}>
    <Link href="/tags/ride/">
      <a className={style.item} aria-label="Link to post list">
        Posts
      </a>
    </Link>
    <Link href="/tags/ride/netherlands">
      <a className={style.item} aria-label="Link to my Netherlands cycling map">
        Netherlands
      </a>
    </Link>
    <Link href="/tags/ride/singapore">
      <a className={style.item} aria-label="Link to my Singapore cycling map">
        Singapore
      </a>
    </Link>
  </section>
)

const Index: NextPage<Props> = ({ config, category, posts }) => {
  const { title, description, url } = config
  const pageTitle = [category[0].toLocaleUpperCase(), category.slice(1)].join(
    ''
  )

  return (
    <>
      <Meta
        title={`${title}, ${category}`}
        description={description}
        url={`${url}/tags/ride/`}
        imageUrl={`${url}/tags/ride/netherlands.png`}
      />
      <Header title={title} url={url} />
      <main>
        <h1>{pageTitle}</h1>
        <Navigation />
        <PostList posts={posts} />
      </main>
    </>
  )
}
export default Index
