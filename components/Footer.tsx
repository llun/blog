import { Activity, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import GithubIcon from './icons/github.svg'
import MastodonIcon from './icons/mastodon.svg'
import WebringIcon from './icons/webring.svg'

export type FooterLink = {
  url: string
  title: string
  icon: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => React.ReactNode)
  target?: '_blank'
  rel?: string
}

const DEFAULT_LINKS: FooterLink[] = [
  {
    url: 'https://github.com/llun',
    title: 'Github',
    icon: GithubIcon,
    target: '_blank'
  },
  {
    url: 'https://llun.dev/@null',
    title: '@null@llun.dev',
    icon: MastodonIcon,
    target: '_blank',
    rel: 'me'
  },
  {
    url: 'https://llun.social/@ride',
    title: '@ride@llun.social',
    icon: Activity,
    target: '_blank',
    rel: 'me'
  },
  {
    url: 'https://webring.wonderful.software#llun.me',
    title: 'Webring',
    icon: WebringIcon,
    target: '_blank'
  }
]

const getLinkRel = (item: FooterLink) => {
  const rels = [
    item.rel,
    item.target === '_blank' ? 'noopener noreferrer' : undefined
  ].filter(Boolean)
  return rels.length > 0 ? rels.join(' ') : undefined
}

type Props = {
  links?: FooterLink[]
}

const Footer = ({ links = DEFAULT_LINKS }: Props) => (
  <footer className="footer">
    <div className="footer-container">
      {links.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          target={item.target}
          rel={getLinkRel(item)}
          className="footer-link"
        >
          <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  </footer>
)

export default Footer
