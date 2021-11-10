import type { GetStaticPropsContext } from 'next'

import {
  Post,
  Config,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../blog'
import Header from '../../components/Header'
import Meta from '../../components/Meta'
import PostList from '../../components/PostList'

type Params = {
  tag: string
}

export async function getStaticPaths() {
  const paths = [{ params: { tag: 'ride' } }, { params: { tag: 'dev' } }]
  return { paths, fallback: false }
}

export async function getStaticProps(context: GetStaticPropsContext<Params>) {
  const { tag } = context.params
  const posts = getAllPosts()
    .filter((post) => post.file.category === tag)
    .sort(postDescendingComparison)
  const config = getConfig()
  return {
    props: {
      posts,
      config,
      category: tag
    }
  }
}

interface Props {
  posts: Post[]
  config: Config
  category: string
}

const Index = ({ posts, config, category }: Props) => {
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
      />
      <Header title={title} url={url} />
      <main>
        <h1>{pageTitle}</h1>
        <PostList posts={posts} />
      </main>
    </>
  )
}
export default Index
