import Link from 'next/link'
import React, { FC } from 'react'
import { Bike, BookImage } from 'lucide-react'

interface Props {
  className?: string
}

const RideTitle: FC<Props> = ({ className }) => (
  <section className={`flex flex-col ${className}`}>
    <h3 className="flex-1">
      <Bike className="w-5 h-5 mr-2 inline align-text-bottom" />
      <Link href="/tags/ride/" className="mr-2" aria-label="Link to post list">
        Posts
      </Link>
      <Link
        href="/tags/ride/netherlands"
        className="mr-2"
        aria-label="Link to my Netherlands cycling map"
      >
        Netherlands
      </Link>
      <Link href={`/tags/ride/netherlands/gallery`} className="mr-2">
        <BookImage className="ride-title-icon" />
      </Link>
      <Link
        href="/tags/ride/singapore"
        className="mr-2"
        aria-label="Link to my Singapore cycling map"
      >
        Singapore
      </Link>
      <Link href={`/tags/ride/singapore/gallery`}>
        <BookImage className="ride-title-icon" />
      </Link>
    </h3>
  </section>
)

export default RideTitle
