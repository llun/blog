import Link from 'next/link'
import React from 'react'
import { Journey } from '../libs/journey'

interface Props {
  journeys: Journey[]
}

const JourneyList = ({ journeys }: Props) => {
  return (
    <ol>
      {journeys.map((journey) => (
        <li key={journey.name}>
          <Link href={`/journeys/${journey.name}/`} passHref>
            <strong>{journey.title}</strong>
          </Link>
          <span>, {journey.description}</span>
        </li>
      ))}
    </ol>
  )
}
export default JourneyList
