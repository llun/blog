import type { GetStaticPropsContext } from 'next'
import { DateTime } from 'luxon'

import { Post, getAllPosts } from '../blog'
import Header from '../components/Header'
import Meta from '../components/Meta'

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
        <ul className="postlist">
          {subPosts.length &&
            subPosts.map((post) => (
              <li className="postlist-item">
                <time className="postlist-date" dateTime={post.properties.date}>
                  {DateTime.fromMillis(post.timestamp).toLocaleString(
                    DateTime.DATE_MED
                  )}
                </time>
                <a href="#" className="postlist-link">
                  {post.properties.title}
                </a>
              </li>
            ))}
        </ul>
      </main>
    </>
  )
}
