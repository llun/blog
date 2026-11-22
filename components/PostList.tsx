import React from 'react'
import { DateTime } from 'luxon'

import type { Post } from '../libs/blog'
import PageLink from './PageLink'
import { getTextLang } from '../libs/utils'

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
          <PageLink
            href={`/posts/${post.file.id}/`}
            className="post-list-item-title"
            title={post.properties.title}
            lang={getTextLang(post.properties.title)}
          >
            {post.properties.title}
          </PageLink>
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
