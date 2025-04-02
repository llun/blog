'use client'

import Link from 'next/link'
import { Bike, BookImage, BookMarked, Computer, LucideIcon } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export type Page = {
  url: string
  image: {
    src: string
    alt: string
  }
  title: string
  icon: LucideIcon | (() => React.ReactNode)
  target?: '_blank'
}
const DEFAULT_PAGES: Page[] = [
  {
    url: '/tags/ride',
    image: {
      src: '/img/icons/ride.png',
      alt: `navigation icon for riding post`
    },
    icon: Bike,
    title: 'Ride'
  },
  {
    url: '/tags/dev',
    image: {
      src: '/img/icons/dev.png',
      alt: `navigation icon for dev post`
    },
    icon: Computer,
    title: 'Dev'
  },
  {
    url: '/gallery',
    image: {
      src: '/img/icons/camera.png',
      alt: `navigation icon for my photos gallery`
    },
    icon: BookImage,
    title: 'Gallery'
  },
  {
    url: '/journeys',
    image: {
      src: '/img/icons/all.png',
      alt: `navigation icon for journeys, story that doesn't move with time`
    },
    icon: BookMarked,
    title: 'Journeys'
  },
  {
    url: 'https://github.com/llun',
    image: {
      src: '/img/icons/github.png',
      alt: `navigation icon for github`
    },
    title: 'Github',
    icon: () => (
      <img src="/img/icons/github.png" alt="Github" className="h-5 w-5" />
    ),
    target: '_blank'
  },
  {
    url: 'https://webring.wonderful.software#llun.me',
    image: {
      src: '/img/icons/webring.black.svg',
      alt: 'วงแหวนเว็บ'
    },
    title: 'Webring',
    icon: () => (
      <img
        src="https://www.llun.me/img/icons/webring.black.svg"
        alt="Webring"
        className="h-5 w-5"
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
              {item.title}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </div>
  </header>
)
export default Header
