import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { Bike, BookImage } from 'lucide-react'

interface Props {
  className?: string
  icon?: { src: string; alt: string }
  currentCountry?: string
}

const COUNTRIES = [
  { name: 'Netherlands', code: 'NL', slug: 'netherlands' },
  { name: 'Singapore', code: 'SG', slug: 'singapore' },
  { name: 'Slovenia', code: 'SI', slug: 'slovenia' }
] as const

const RideTitle: FC<Props> = ({ icon, className, currentCountry }) => (
  <section className={`flex flex-col ${className}`}>
    <h3 className="flex-1">
      {icon && (
        <Image
          className="ride-title-image"
          {...icon}
          alt="Page icon"
          width={20}
          height={20}
        />
      )}
      {!icon && <Bike className="w-5 h-5 mr-2 inline align-text-bottom" />}
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
          {currentCountry === country.slug && (
            <Link href={`/tags/ride/${country.slug}/gallery`} className="mr-2">
              <BookImage className="ride-title-icon" />
            </Link>
          )}
        </React.Fragment>
      ))}
    </h3>
  </section>
)

export default RideTitle
