import type { GetStaticPropsContext } from 'next'

import Link from 'next/link'
import path from 'path'

import { parseJourney, getAllJourneys, Journey } from '../../journey'
import { getConfig, Config } from '../../blog'
import Meta from '../../components/Meta'
import style from './[title].module.css'

type Params = {
  title: string
}

export async function getStaticPaths() {
  const paths = getAllJourneys()
    .filter((journey) => !journey.custom)
    .map((journey) => ({
      params: { title: journey.name }
    }))
  return { paths, fallback: false }
}

export async function getStaticProps(context: GetStaticPropsContext<Params>) {
  const config = getConfig()
  const { params } = context
  const { title } = params

  const contentPath = path.join(process.cwd(), 'journeys', title)
  const journey = parseJourney(contentPath, true)
  return {
    props: {
      config,
      journey
    }
  }
}

interface Props {
  config: Config
  journey: Journey
}

const Journey = ({ config, journey }: Props) => {
  const { title, url } = config
  const { content, title: journeyTitle, description, name } = journey
  return (
    <>
      <Meta
        title={`${title}, ${journeyTitle}`}
        description={description}
        url={`${url}/journeys/${name}`}
      />
      <main>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
        <div
          className={style.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
      </main>
    </>
  )
}
export default Journey
