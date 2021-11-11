import type { GetStaticPropsContext } from 'next'

import { Config, getConfig } from '../../blog'
import { Journey, getAllJourneys } from '../../journey'
import Header from '../../components/Header'
import Meta from '../../components/Meta'
import JourneyList from '../../components/JourneyList'

export async function getStaticProps(context: GetStaticPropsContext) {
  const config = getConfig()
  const journeys = getAllJourneys()
  return {
    props: {
      config,
      journeys
    }
  }
}

interface Props {
  config: Config
  journeys: Journey[]
}

const Index = ({ config, journeys }: Props) => {
  const { title, description, url } = config
  return (
    <>
      <Meta title={title} description={description} url={url} />
      <Header title={title} url={url} />
      <main>
        <h1>Journeys</h1>
        <p>A collection of long running topic that I keep updating</p>
        <JourneyList journeys={journeys} />
      </main>
    </>
  )
}
export default Index
