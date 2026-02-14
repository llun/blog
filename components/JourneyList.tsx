import Link from 'next/link'
import React from 'react'
import { Journey } from '../libs/journey'

interface Props {
  journeys: Journey[]
}

const SAFE_ROUTE_SEGMENT = /^[A-Za-z0-9._-]+$/

const JourneyList = ({ journeys }: Props) => {
  return (
    <ol>
      {journeys.map((journey) => {
        if (!SAFE_ROUTE_SEGMENT.test(journey.name)) {
          return null
        }

        const journeyHref = `/journeys/${journey.name}/`
        return (
          <li key={journey.name}>
            <Link href={journeyHref} passHref>
              <strong>{journey.title}</strong>
            </Link>
            <span>, {journey.description}</span>
          </li>
        )
      })}
    </ol>
  )
}
export default JourneyList
