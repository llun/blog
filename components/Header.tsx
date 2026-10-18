import { Bike, BookImage, BookMarked, Computer, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

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
    icon: Computer,
    title: 'Dev'
  },
  {
    url: '/gallery',
    icon: BookImage,
    title: 'Gallery'
  },
  {
    url: '/journeys',
    icon: BookMarked,
    title: 'Journeys'
  }
]

const getLinkRel = (item: Page) => {
  const rels = [
    item.rel,
    item.target === '_blank' ? 'noopener noreferrer' : undefined
  ].filter(Boolean)
  return rels.length > 0 ? rels.join(' ') : undefined
}

type Props = {
  title: string
  url: string
  pages?: Page[]
}

const Header = ({ title, url, pages = DEFAULT_PAGES }: Props) => (
  <header className="header">
    <div className="header-container">
      <Link href={url} className="logo-link">
        <span className="logo-text">{title}</span>
      </Link>
      <div className="nav-container">
        <nav className="nav-bar">
          {pages.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              target={item.target}
              rel={getLinkRel(item)}
              className={'nav-link'}
              aria-label={item.title}
            >
              <item.icon
                className="h-4 w-4 shrink-0 sm:mr-2"
                aria-hidden="true"
              />
              <span className="nav-link-text">{item.title}</span>
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </div>
  </header>
)
export default Header
