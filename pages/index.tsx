import type { GetStaticPropsContext } from 'next'

import { Post, Config, getAllPosts, getConfig } from '../blog'
import Header from '../components/Header'
import Meta from '../components/Meta'
import PostList from '../components/PostList'

export async function getStaticProps(context: GetStaticPropsContext) {
  const posts = getAllPosts()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20)
  const config = getConfig()
  return {
    props: {
      posts,
      config
    }
  }
}

interface Props {
  posts: Post[]
  config: Config
}

const Index = ({ posts, config }: Props) => {
  const { title, description, url } = config
  return (
    <>
      <Meta title={title} description={description} url={url} />
      <Header title={title} url={url} />
      <main>
        <PostList posts={posts} />
      </main>
    </>
  )
}
export default Index
