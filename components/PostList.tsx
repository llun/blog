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
              .toFormat('dd LLL yyyy')}
          </time>
          <Link
            href={`/posts/${post.file.id}`}
            className="post-list-item-title"
            title={post.properties.title}
          >
            {post.properties.title}
          </Link>
          {post.file.category ? (
            <span className="post-list-item-tag">{post.file.category}</span>
          ) : (
            <span />
          )}
        </li>
      ))}
    </ul>
  )
}

export default PostList
