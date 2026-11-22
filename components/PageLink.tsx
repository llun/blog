import Link from 'next/link'
import React, { ComponentProps } from 'react'

type Props = ComponentProps<'a'> & { href: string }

// next/link drops the trailing slash from paths whose last segment looks like
// a file name (e.g. /posts/dev/2015-01-01-Ember.js/), and S3 answers the
// slashless URL with a redirect. Those links stay plain anchors so they keep
// the slash; every other page link goes through next/link.
const PageLink = ({ href, ...props }: Props) => {
  const lastSegment = href.replace(/\/$/, '').split('/').pop() ?? ''
  if (href.endsWith('/') && lastSegment.includes('.')) {
    return <a href={href} {...props} />
  }
  return <Link href={href} {...props} />
}

export default PageLink
