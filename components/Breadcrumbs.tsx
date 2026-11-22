import React, { Fragment } from 'react'

import type { Crumb } from '../libs/structuredData'
import { pagePath } from '../libs/seo'
import { getTextLang } from '../libs/utils'
import PageLink from './PageLink'

interface Props {
  crumbs: Crumb[]
}

// A mono trail above the page title: every step back up is a link, the page
// itself is plain text. The same crumbs feed the BreadcrumbList JSON-LD.
const Breadcrumbs = ({ crumbs }: Props) => {
  if (crumbs.length < 2) return null
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          return (
            <Fragment key={crumb.path}>
              <li className="breadcrumbs-item">
                {last ? (
                  <span aria-current="page" lang={getTextLang(crumb.name)}>
                    {crumb.name}
                  </span>
                ) : (
                  <PageLink
                    href={pagePath(crumb.path)}
                    className="breadcrumbs-link"
                    lang={getTextLang(crumb.name)}
                  >
                    {crumb.name}
                  </PageLink>
                )}
              </li>
              {!last && (
                <li className="breadcrumbs-separator" aria-hidden="true">
                  /
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
