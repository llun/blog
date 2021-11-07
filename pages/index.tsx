import type { GetStaticPropsContext } from 'next'

import { getAllPosts } from '../blog'
import Header from '../components/Header'
import Meta from '../components/Meta'

export async function getStaticProps(context: GetStaticPropsContext) {
  const posts = getAllPosts()
  return {
    props: {} // will be passed to the page component as props
  }
}

export default () => {
  const title = '@แนท'
  const description = 'My notebook'
  const url = 'https://www.llun.me'
  return (
    <>
      <Meta title={title} description={description} url={url} />
      <Header title={title} url={url} />
    </>
  )
}
