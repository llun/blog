import type { GetStaticPropsContext } from 'next'

import Link from 'next/link'
import path from 'path'

import { parseJourney, getAllJourneys, Journey } from '../../journey'
import { getConfig, Config } from '../../blog'
import Meta from '../../components/Meta'

export async function getStaticProps(context: GetStaticPropsContext<{}>) {
  const config = getConfig()
  const { params } = context

  return {
    props: {
      config
    }
  }
}

interface Props {
  config: Config
}

const Journey = ({ config }: Props) => {
  const { title, url } = config
  return (
    <>
      <Meta
        title={`${title}, Wordle`}
        description="Just my wordle journey each day"
        url={`${url}/journeys/wordle`}
      />
      <main>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
        <div>Test</div>
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
