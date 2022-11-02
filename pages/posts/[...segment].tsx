import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import path from 'path'
import React from 'react'

import {
  Config,
  Post,
  getConfig,
  getAllPosts,
  parsePost
} from '../../libs/blog'
import Meta from '../../components/Meta'
import style from './[...segment].module.css'

interface Props {
  config: Config
  post: Post
  segment: string[]
}

type Params = {
  segment: string[]
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  const paths = posts.map((post) => ({
    params: {
      segment: post.file.id.split('/')
    }
  }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const config = getConfig()
  const { params } = context
  if (!params) {
    return {
      notFound: true
    }
  }

  const { segment } = params
  const contentPath = path.join(
    process.cwd(),
    'contents',
    'posts',
    ...segment,
    'index.md'
  )
  const post = parsePost(config, contentPath, true)
  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      config,
      post,
      segment
    }
  }
}

const Page: NextPage<Props> = ({ config, post, segment }) => {
  const { title, url } = config
  const { properties, content, file } = post
  return (
    <>
      <Meta
        title={`${title} | ${properties.title}`}
        description={properties.description}
        url={`${url}/posts/${file.id}`}
        imageUrl={
          properties.image && `${url}/posts/${file.id}/${properties.image}`
        }
      />
      <main>
        <p>
          <Link href="/">← Home</Link>
        </p>

        <div className={style.title}>
          <h1>{properties.title}</h1>
        </div>

        <div
          className={style.content}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />

        <p>
          <a
            href={`mailto:comment@llun.me?subject=Common on post ${segment.join(
              '/'
            )}`}
          >
            Send a comment
          </a>
        </p>

        <p>
          <Link href="/">← Home</Link>
        </p>
      </main>
    </>
  )
}
export default Page
