import Link from 'next/link'
import React from 'react'
import { Journey } from '../libs/journey'
import style from './JourneyList.module.css'

interface Props {
  journeys: Journey[]
}

const JourneyList = ({ journeys }: Props) => {
  return (
    <ol className={style.list}>
      {journeys.map((journey) => (
        <li key={journey.name}>
          <Link href={`/journeys/${journey.name}/`} passHref>

            <strong className={style.title}>{journey.title}</strong>

          </Link>
          <span>, {journey.description}</span>
        </li>
      ))}
    </ol>
  );
}
export default JourneyList
