import { Bike, Bird, LucideIcon, Terminal } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { GalleryIcon } from './icons'
import { LogoMark } from './Logo'
import { NavLink } from './NavLink'
import { ThemeToggle } from './ThemeToggle'

export type Page = {
  url: string
  title: string
  icon: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => React.ReactNode)
  target?: '_blank'
  rel?: string
}
const DEFAULT_PAGES: Page[] = [
  {
    url: '/tags/ride',
    icon: Bike,
    title: 'Ride'
  },
  {
    url: '/tags/dev',
    icon: Terminal,
    title: 'Dev'
  },
  {
    url: '/gallery',
    icon: GalleryIcon,
    title: 'Gallery'
  },
  {
    url: '/birds',
    icon: Bird,
    title: 'Birds'
  }
]

const getLinkRel = (item: Page) => {
  const rels = [
    item.rel,
    item.target === '_blank' ? 'noopener noreferrer' : undefined
  ].filter(Boolean)
  return rels.length > 0 ? rels.join(' ') : undefined
}

// The header shows the name without the handle's leading @; the full title
// stays in page titles and feeds
const getWordmark = (title: string) => title.replace(/^@/, '')

type Props = {
  title: string
  url: string
  pages?: Page[]
}

const Header = ({ title, url, pages = DEFAULT_PAGES }: Props) => (
  <header className="header">
    <div className="header-container">
      <Link href={url} className="logo-link" aria-label={title}>
        <LogoMark />
        <span className="logo-text">{getWordmark(title)}</span>
      </Link>
      <div className="nav-container">
        <nav className="nav-bar">
          {pages.map((item) => (
            <NavLink
              key={item.url}
              href={item.url}
              target={item.target}
              rel={getLinkRel(item)}
              label={item.title}
            >
              <item.icon
                className="h-4 w-4 shrink-0 sm:mr-2"
                aria-hidden="true"
              />
              <span className="nav-link-text">{item.title}</span>
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </div>
  </header>
)
export default Header
