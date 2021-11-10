import { DateTime } from 'luxon'
import Link from 'next/link'

import style from './PostList.module.css'
import type { Post } from '../blog'

interface Props {
  posts: Post[]
}

const PostList = ({ posts }: Props) => (
  <ul className={style.list}>
    {posts.length &&
      posts.map((post) => (
        <li key={post.timestamp} className={style.item}>
          <time className={style.date} dateTime={post.properties.date}>
            {DateTime.fromMillis(post.timestamp).toLocaleString(
              DateTime.DATE_MED
            )}
          </time>
          <Link href={`/posts/${post.file.id}/`}>
            <a className={style.link}>{post.properties.title}</a>
          </Link>
        </li>
      ))}
  </ul>
)
export default PostList
