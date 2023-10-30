import { Metadata } from 'next'

import { getMetadata } from '../../../components/Meta'
import PostList from '../../../components/PostList'
import {
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../../../libs/blog'

import 'mapbox-gl/dist/mapbox-gl.css'

const getTagTitle = (tag: string) =>
  [tag[0].toLocaleUpperCase(), tag.slice(1)].join('')

interface Props {
  params: { tag: string }
}

export const generateStaticParams = async () => {
  return [{ tag: 'dev' }]
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { tag } = params
  const { url, title, description } = getConfig()
  return getMetadata({
    url,
    title: `${title}, ${getTagTitle(tag)}`,
    description
  })
}

const Tag = ({ params }: Props) => {
  const { tag } = params
  const posts = getAllPosts()
    .filter((post) => post.file.category === tag)
    .sort(postDescendingComparison)

  return (
    <main>
      <h2>{getTagTitle(tag)}</h2>
      <PostList posts={posts} />
    </main>
  )
}

export default Tag
