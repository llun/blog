import Link from 'next/link'
import { Journey } from '../journey'
import style from './JourneyList.module.css'

interface Props {
  journeys: Journey[]
}

const JourneyList = ({ journeys }: Props) => {
  return (
    <ol className={style.list}>
      {journeys.map((journey) => (
        <li key={journey.name}>
          <Link href={`/journeys/${journey.name}/index.html`}>
            <a>
              <strong className={style.title}>{journey.title}</strong>
            </a>
          </Link>
          <span>{journey.description}</span>
        </li>
      ))}
    </ol>
  )
}
export default JourneyList
