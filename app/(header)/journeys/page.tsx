import React from 'react'

import JourneyList from '../../../components/JourneyList'
import { getAllJourneys } from '../../../libs/journey'

const Journeys = () => {
  const journeys = getAllJourneys()

  return (
    <>
      <h2 className="mt-2">Journeys</h2>
      <p className="mb-2">
        A collection of long running topic that I keep updating
      </p>
      <JourneyList journeys={journeys} />
    </>
  )
}

export default Journeys
