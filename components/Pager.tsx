import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'

import { getTextLang } from '../libs/utils'
import PageLink from './PageLink'

export interface PagerLink {
  href: string
  title: string
}

interface Props {
  label: string
  previous?: PagerLink | null
  next?: PagerLink | null
  previousLabel?: string
  nextLabel?: string
}

// Two framed cells, previous on the left and next on the right, each with a
// mono label over the title
const Pager = ({
  label,
  previous,
  next,
  previousLabel = 'Previous',
  nextLabel = 'Next'
}: Props) => {
  if (!previous && !next) return null
  return (
    <nav className="pager" aria-label={label}>
      {previous ? (
        <PageLink href={previous.href} className="pager-link" rel="prev">
          <span className="pager-label">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {previousLabel}
          </span>
          <span className="pager-title" lang={getTextLang(previous.title)}>
            {previous.title}
          </span>
        </PageLink>
      ) : (
        <span className="pager-empty" />
      )}
      {next ? (
        <PageLink
          href={next.href}
          className="pager-link pager-link-next"
          rel="next"
        >
          <span className="pager-label">
            {nextLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="pager-title" lang={getTextLang(next.title)}>
            {next.title}
          </span>
        </PageLink>
      ) : (
        <span className="pager-empty" />
      )}
    </nav>
  )
}

export default Pager
