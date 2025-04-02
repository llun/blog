'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bike, BookImage, BookMarked, Computer, LucideIcon } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import style from './Header.module.css'

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

const NewHeader = ({ title, url, pages = DEFAULT_PAGES }: Props) => (
  <header className="header-base">
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

const Header = ({ title, url, pages = DEFAULT_PAGES }: Props) => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <h1>
      <Link href={url} legacyBehavior>
        {title}
      </Link>
    </h1>
    <nav className={style.nav}>
      <ul>
        {pages.map((page) => (
          <li key={page.url}>
            {page.target && (
              <a href={page.url} target={page.target}>
                <Image
                  className={style.icon}
                  {...page.image}
                  width={26}
                  height={26}
                  alt={page.image.alt}
                />
                <span className={style.text}>{page.title}</span>
              </a>
            )}
            {!page.target && (
              <Link href={page.url}>
                <Image
                  className={style.icon}
                  {...page.image}
                  width={26}
                  height={26}
                  alt={page.image.alt}
                />
                <span className={style.text}>{page.title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  </header>
)
export default NewHeader
