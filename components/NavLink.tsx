'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

type Props = {
  href: string
  target?: '_blank'
  rel?: string
  label: string
  children: ReactNode
}

const isCurrent = (pathname: string | null, href: string) => {
  if (!pathname || href.startsWith('http')) return false
  const base = href.replace(/\/$/, '')
  return pathname === base || pathname.startsWith(`${base}/`)
}

// A header link that marks itself as the current section
export const NavLink = ({ href, target, rel, label, children }: Props) => {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className="nav-link"
      aria-label={label}
      aria-current={isCurrent(pathname, href) ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
