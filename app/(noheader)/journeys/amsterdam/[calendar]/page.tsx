import React, { FC } from 'react'

import { getAllCalendars, getCalendar } from '../../../../../libs/amsterdam'
import { MainContent } from '../MainContent'

export const generateStaticParams = async () => {
  const calendars = await getAllCalendars()
  return calendars.map((calendar) => ({
    calendar: calendar.id
  }))
}

interface Props {
  params: Promise<{ calendar: string }>
}

const CalendarPage: FC<Props> = async ({ params }) => {
  const { calendar } = await params
  const currentCalendar = await getCalendar(calendar)
  const calendars = await getAllCalendars()
  return <MainContent calendars={calendars} currentCalendar={currentCalendar} />
}

export default CalendarPage
