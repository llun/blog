import cn from 'classnames'
import Link from 'next/link'
import React, { FC } from 'react'
import { Bike } from 'lucide-react'

import { Flag } from './Flag'
import { GalleryIcon } from './icons'

export const RIDE_COUNTRIES = [
  { name: 'Netherlands', code: 'NL', slug: 'netherlands' },
  { name: 'Singapore', code: 'SG', slug: 'singapore' },
  { name: 'Slovenia', code: 'SI', slug: 'slovenia' }
] as const

interface Props {
  className?: string
  // The page being shown; leave it out on the ride post list
  current?: { country: string; view: 'map' | 'photos' }
}

// N2 segmented keys: Posts, then one key per country split into its map and
// its photos. The page being shown is the filled black part.
const RideNav: FC<Props> = ({ current, className }) => (
  <nav className={cn('ride-nav', className)} aria-label="Rides">
    <span className={cn('ride-key', { 'ride-key-current': !current })}>
      <Link
        href="/tags/ride/"
        className="ride-key-part"
        aria-current={!current ? 'page' : undefined}
      >
        <Bike className="h-4 w-4" aria-hidden="true" />
        Posts
      </Link>
    </span>
    {RIDE_COUNTRIES.map((country) => {
      const here = current?.country === country.slug
      const onMap = here && current?.view === 'map'
      const onPhotos = here && current?.view === 'photos'
      return (
        <span key={country.slug} className="ride-key">
          <Link
            href={`/tags/ride/${country.slug}/`}
            className={cn('ride-key-part', { 'ride-key-current': onMap })}
            aria-current={onMap ? 'page' : undefined}
            aria-label={`${country.name} ride map`}
          >
            <Flag code={country.code} decorative className="ride-key-flag" />
            <span className="sm:hidden">{country.code}</span>
            <span className="hidden sm:inline">{country.name}</span>
          </Link>
          <Link
            href={`/tags/ride/${country.slug}/gallery/`}
            className={cn('ride-key-part ride-key-photos', {
              'ride-key-current': onPhotos
            })}
            aria-current={onPhotos ? 'page' : undefined}
            aria-label={`${country.name} ride photos`}
          >
            <GalleryIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </span>
      )
    })}
  </nav>
)

export default RideNav
