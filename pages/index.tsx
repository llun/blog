import type { GetStaticPropsContext } from 'next'
import { DateTime } from 'luxon'

import { Post, getAllPosts } from '../blog'
import Header from '../components/Header'
import Meta from '../components/Meta'
import PostList from '../components/PostList'

export async function getStaticProps(context: GetStaticPropsContext) {
  const posts = getAllPosts()
  return {
    props: {
      posts
    } // will be passed to the page component as props
  }
}

type Props = {
  posts: Post[]
}

export default ({ posts }: Props) => {
  const title = '@แนท'
  const description = 'My notebook'
  const url = 'https://www.llun.me'
  const subPosts = posts.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20)
  return (
    <>
      <Meta title={title} description={description} url={url} />
      <Header title={title} url={url} />
      <main>
        <PostList posts={subPosts} />
      </main>
    </>
  )
}
