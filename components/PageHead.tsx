import React, { ReactNode } from 'react'

interface Props {
  title: ReactNode
  meta?: ReactNode
  lang?: string
}

// The opening of every list page: an h1 and an optional count beside it
const PageHead = ({ title, meta, lang }: Props) => (
  <header className="page-head">
    <h1 className="page-title" lang={lang}>
      {title}
    </h1>
    {meta && <p className="page-head-meta">{meta}</p>}
  </header>
)

export default PageHead
