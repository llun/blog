import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import style from './Header.module.css'

export type Page = {
  url: string
  image: {
    src: string
    alt: string
  }
  title: string
  target?: '_blank'
}
const defaultPages: Page[] = [
  {
    url: '/tags/ride',
    image: {
      src: '/img/icons/ride.png',
      alt: `navigation icon for riding post`
    },
    title: 'Ride'
  },
  {
    url: '/tags/dev',
    image: {
      src: '/img/icons/dev.png',
      alt: `navigation icon for dev post`
    },
    title: 'Dev'
  },
  {
    url: '/gallery',
    image: {
      src: '/img/icons/camera.png',
      alt: `navigation icon for my photos gallery`
    },
    title: 'Gallery'
  },
  {
    url: '/journeys',
    image: {
      src: '/img/icons/all.png',
      alt: `navigation icon for journeys, story that doesn't move with time`
    },
    title: 'Journeys'
  },
  {
    url: 'https://github.com/llun',
    image: {
      src: '/img/icons/github.png',
      alt: `navigation icon for github`
    },
    title: 'Github',
    target: '_blank'
  },
  {
    url: 'https://webring.wonderful.software#llun.me',
    image: {
      src: '/img/icons/webring.black.svg',
      alt: 'วงแหวนเว็บ'
    },
    title: 'Webring',
    target: '_blank'
  }
]

type Props = {
  title: string
  url: string
  pages?: Page[]
}

const Header = ({ title, url, pages = defaultPages }: Props) => (
  <header>
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
export default Header
