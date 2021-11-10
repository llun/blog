import type { GetStaticPropsContext } from 'next'

import path from 'path'

import { parseJourney, getAllJourneys, Journey } from '../../journey'
import { getConfig, Config } from '../../blog'
import Meta from '../../components/Meta'
import Header from '../../components/Header'

type Params = {
  title: string
}

export async function getStaticPaths() {
  const paths = getAllJourneys().map((journey) => ({
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
  const { title, description, url } = config
  const { content } = journey
  return (
    <>
      <Meta title={title} description={description} url={url} />
      <Header title={title} url={url} />
      <main>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </main>
    </>
  )
}
export default Journey
