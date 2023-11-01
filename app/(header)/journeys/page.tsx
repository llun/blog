import React from 'react'

import JourneyList from '../../../components/JourneyList'
import { getAllJourneys } from '../../../libs/journey'
import style from './journeys.module.css'

export const Journeys = () => {
  const journeys = getAllJourneys()

  return (
    <main>
      <h2>Journeys</h2>
      <p className={style.description}>
        A collection of long running topic that I keep updating
      </p>
      <JourneyList journeys={journeys} />
    </main>
  )
}

export default Journeys
