import { DateTime } from 'luxon'

import style from './PostList.module.css'
import type { Post } from '../blog'

interface Props {
  posts: Post[]
}

export default ({ posts }: Props) => (
  <ul className={style.list}>
    {posts.length &&
      posts.map((post) => (
        <li className={style.item}>
          <time className={style.date} dateTime={post.properties.date}>
            {DateTime.fromMillis(post.timestamp).toLocaleString(
              DateTime.DATE_MED
            )}
          </time>
          <a href="#" className={style.link}>
            {post.properties.title}
          </a>
        </li>
      ))}
  </ul>
)
