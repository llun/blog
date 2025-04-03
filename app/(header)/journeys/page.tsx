import React from 'react'

import JourneyList from '../../../components/JourneyList'
import { getAllJourneys } from '../../../libs/journey'

const Journeys = () => {
  const journeys = getAllJourneys()

  return (
    <main>
      <h2 className="mb-2">Journeys</h2>
      <p className="mb-2">
        A collection of long running topic that I keep updating
      </p>
      <JourneyList journeys={journeys} />
    </main>
  )
}

export default Journeys
