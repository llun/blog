import Link from 'next/link'
import style from './Header.module.css'

export type Page = {
  url: string
  image: {
    src: any
    alt: string
  }
  title: string
  target?: '_blank'
}
const defaultPages: Page[] = [
  {
    url: '/journeys',
    image: {
      src: '/img/icons/all.png',
      alt: `navigation icon for journeys, story that doesn't move with time`
    },
    title: 'Journeys'
  },
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
      src: 'https://webring.wonderful.software/webring.black.svg',
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

export default ({ title, url, pages = defaultPages }: Props) => (
  <header>
    <h1>
      <Link href={url}>{title}</Link>
    </h1>
    <nav className={style.nav}>
      <ul>
        {pages.map((page) => (
          <li key={page.url}>
            {page.target && (
              <a href={page.url} target={page.target}>
                <img className={style.icon} {...page.image} />
                <span className={style.text}>{page.title}</span>
              </a>
            )}
            {!page.target && (
              <Link href={page.url}>
                <a>
                  <img className={style.icon} {...page.image} />
                  <span className={style.text}>{page.title}</span>
                </a>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  </header>
)
