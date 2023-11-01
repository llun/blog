'use client'

import { useRouter } from 'next/navigation'
import React, { FC } from 'react'

import { Calendar } from '../../../../libs/amsterdam'

interface Props {
  calendars: Calendar[]
  currentCalendar?: Calendar | null
}

export const getCalendarTitle = (calendar: Calendar) =>
  `${[calendar.month[0].toLocaleUpperCase(), calendar.month.slice(1)].join(
    ''
  )} ${calendar.year}`

export const CalendarSelector: FC<Props> = ({ calendars, currentCalendar }) => {
  const router = useRouter()

  return (
    <select
      value={currentCalendar?.id ?? '-'}
      onChange={(event) => {
        const { value } = event.currentTarget
        if (value === '-') {
          return router.push(`/journeys/amsterdam`)
        }
        router.push(`/journeys/amsterdam/${value}`)
      }}
    >
      <option>-</option>
      {calendars.map((calendar) => {
        return (
          <option key={calendar.id} value={calendar.id}>
            {getCalendarTitle(calendar)}
          </option>
        )
      })}
    </select>
  )
}
