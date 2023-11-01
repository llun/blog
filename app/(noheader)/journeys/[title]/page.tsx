import _ from 'lodash'
import Link from 'next/link'
import path from 'path'
import React from 'react'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMetadata } from '../../../../components/Meta'
import { getConfig } from '../../../../libs/blog'
import { getAllJourneys, parseJourney } from '../../../../libs/journey'
import style from './journey.module.css'

interface Props {
  params: { title: string }
}

const getJourney = _.memoize((title: string) => {
  const contentPath = path.join(process.cwd(), 'contents', 'journeys', title)
  const journey = parseJourney(contentPath, true)
  return journey
})

export const generateStaticParams = async () => {
  return getAllJourneys()
    .filter((journey) => !journey.custom)
    .map((journey) => ({
      title: journey.name
    }))
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { title } = params
  const { title: configTitle, description, url } = getConfig()
  const data = getJourney(title)
  if (!data) {
    return getMetadata({ url, title: configTitle, description })
  }

  const { title: journeyTitle, description: journeyDescription } = data
  return getMetadata({
    url,
    title: `${configTitle}, ${journeyTitle}`,
    description: journeyDescription
  })
}

const Journey = ({ params }: Props) => {
  const { title } = params
  const journey = getJourney(title)
  if (!journey) {
    return notFound()
  }

  const { content } = journey
  return (
    <main>
      <p>
        <Link href="/journeys">← Journeys</Link>
      </p>
      <div
        className={style.content}
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
      <p>
        <Link href="/journeys">← Journeys</Link>
      </p>
    </main>
  )
}

export default Journey
