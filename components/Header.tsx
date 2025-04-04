'use client'

import Link from 'next/link'
import { Bike, BookImage, BookMarked, Computer, LucideIcon } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import React from 'react'
export type Page = {
  url: string
  title: string
  icon: LucideIcon | (() => React.ReactNode)
  target?: '_blank'
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
  },
  {
    url: 'https://github.com/llun',
    title: 'Github',
    icon: () => <img src="/img/icons/github.png" alt="Github" />,
    target: '_blank'
  },
  {
    url: 'https://webring.wonderful.software#llun.me',
    title: 'Webring',
    icon: () => (
      <img
        src="https://www.llun.me/img/icons/webring.black.svg"
        alt="Webring"
      />
    ),
    target: '_blank'
  }
]

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
              rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              className={'nav-link'}
            >
              <item.icon className="mr-2 h-4 w-4" />
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
