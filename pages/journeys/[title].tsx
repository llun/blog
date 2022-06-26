import type { GetStaticPaths, GetStaticProps } from 'next'

import Link from 'next/link'
import path from 'path'

import { parseJourney, getAllJourneys, Journey } from '../../libs/journey'
import { getConfig, Config } from '../../libs/blog'
import Meta from '../../components/Meta'
import style from './[title].module.css'

interface Props {
  config: Config
  journey: Journey
}

type Params = {
  title: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllJourneys()
    .filter((journey) => !journey.custom)
    .map((journey) => ({
      params: { title: journey.name }
    }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params = { title: '' }
}) => {
  const config = getConfig()
  const { title } = params

  const contentPath = path.join(process.cwd(), 'contents', 'journeys', title)
  const journey = parseJourney(contentPath, true)

  if (!journey) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      config,
      journey
    }
  }
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
          dangerouslySetInnerHTML={{ __html: content || '' }}
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
