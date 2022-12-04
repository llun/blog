import type { GetStaticProps } from 'next'
import React from 'react'

import { Config, getConfig } from '../../libs/blog'
import { Journey, getAllJourneys } from '../../libs/journey'
import Header from '../../components/Header'
import Meta from '../../components/Meta'
import JourneyList from '../../components/JourneyList'
import style from './index.module.css'

export const getStaticProps: GetStaticProps = async () => {
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
      <Meta
        title={title}
        description={description}
        url={`${url}/journeys`}
        canonical={`${url}/journeys`}
      />
      <Header title={title} url={`${url}/journeys`} />
      <main>
        <h2>Journeys</h2>
        <p className={style.description}>
          A collection of long running topic that I keep updating
        </p>
        <JourneyList journeys={journeys} />
      </main>
    </>
  )
}
export default Index
