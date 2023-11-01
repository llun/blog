import React from 'react'

import { getAllCalendars } from '../../../../libs/amsterdam'
import { MainContent } from './MainContent'

const AmsterdamIndexPage = async () => {
  const calendars = await getAllCalendars()
  return <MainContent calendars={calendars} />
}

export default AmsterdamIndexPage
