import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { Bike, BookImage } from 'lucide-react'

interface Props {
  className?: string
  icon?: { src: string; alt: string }
}

const RideTitle: FC<Props> = ({ icon, className }) => (
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
