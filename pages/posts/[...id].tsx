import type { GetStaticPropsContext } from 'next'

import { useRouter } from 'next/router'

import { Config, getConfig, getAllPosts } from '../../blog'
import Meta from '../../components/Meta'
import Header from '../../components/Header'

export async function getStaticPaths() {
  const posts = getAllPosts()
  const paths = posts.map((post) => ({
    params: { id: post.file.id.split('/') }
  }))
  return { paths, fallback: false }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const config = getConfig()
  return {
    props: {
      config
    }
  }
}

interface Props {
  config: Config
}

export default ({ config }: Props) => {
  const router = useRouter()
  const { id } = router.query

  const { title, description, url } = config
  return (
    <>
      <Meta title={title} description={description} url={url} />
      <Header title={title} url={url} />
      <main>{id}</main>
    </>
  )
}
