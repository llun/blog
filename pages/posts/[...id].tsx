import type { GetStaticPropsContext } from 'next'

import Link from 'next/link'
import path from 'path'

import { Config, Post, getConfig, getAllPosts, parsePost } from '../../blog'
import Meta from '../../components/Meta'
import style from './[...id].module.css'

type Params = { id: string[] }
type Data = {
  props: {
    config: Config
    post: Post
    id: string[]
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  const paths = posts.map((post) => ({
    params: { id: post.file.id.split('/') }
  }))
  return { paths, fallback: false }
}

export async function getStaticProps(
  context: GetStaticPropsContext<Params, Data>
) {
  const config = getConfig()
  const { params } = context
  const { id } = params

  const contentPath = path.join(process.cwd(), 'posts', ...id, 'index.md')
  const post = parsePost(contentPath, true)
  return {
    props: {
      config,
      post,
      id
    }
  }
}

interface Props {
  config: Config
  post: Post
  id: string[]
}

export default ({ config, post, id }: Props) => {
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
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <p>
          <a
            href={`mailto:comment@llun.me?subject=Common on post ${id.join(
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
