import cn from 'classnames'
import Link from 'next/link'
import React, { FC } from 'react'
import { Bike } from 'lucide-react'

import { Flag, FlagCode } from './Flag'
import { GalleryIcon } from './icons'

interface Props {
  className?: string
  flag?: FlagCode
}

const COUNTRIES = [
  { name: 'Netherlands', code: 'NL', slug: 'netherlands' },
  { name: 'Singapore', code: 'SG', slug: 'singapore' },
  { name: 'Slovenia', code: 'SI', slug: 'slovenia' }
] as const

const RideTitle: FC<Props> = ({ flag, className }) => (
  <section className={cn('flex flex-col', className)}>
    <h3 className="flex-1">
      {flag && <Flag code={flag} className="ride-title-image" />}
      {!flag && <Bike className="w-5 h-5 mr-2 inline align-text-bottom" />}
      <Link href="/tags/ride/" className="mr-2" aria-label="Link to post list">
        Posts
      </Link>
      {COUNTRIES.map((country) => (
        <React.Fragment key={country.slug}>
          <Link
            href={`/tags/ride/${country.slug}`}
            className="mr-2"
            aria-label={`Link to my ${country.name} cycling map`}
          >
            <span className="sm:hidden">{country.code}</span>
            <span className="hidden sm:inline">{country.name}</span>
          </Link>
          <Link
            href={`/tags/ride/${country.slug}/gallery`}
            className="mr-2"
            aria-label={`Link to my ${country.name} cycling photos`}
          >
            <GalleryIcon className="ride-title-icon" aria-hidden="true" />
          </Link>
        </React.Fragment>
      ))}
    </h3>
  </section>
)

export default RideTitle
