import React from 'react'
import { DateTime } from 'luxon'
import Link from 'next/link'

import type { Post } from '../libs/blog'

interface Props {
  posts: Post[]
}

const PostList = ({ posts }: Props) => {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.file.id} className="post-list-item">
          <time dateTime={post.properties.date} className="post-list-item-date">
            {DateTime.fromMillis(post.timestamp)
              .setLocale('en-US')
              .toLocaleString(DateTime.DATE_MED)}
          </time>
          <Link
            href={`/posts/${post.file.id}`}
            className="post-list-item-title"
            title={post.properties.title}
          >
            {post.properties.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default PostList
