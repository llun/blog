'use client'

import { useRouter } from 'next/navigation'
import React, { FC } from 'react'

import { Result } from '../../../../libs/wordle'

interface Props {
  result?: Result | null
  list: Result[]
}

export const idficationTitle = (title: string) =>
  title.toLocaleLowerCase().substring(7).replace(/\s+/g, '-')

export const DateSelector: FC<Props> = ({ list, result }) => {
  const router = useRouter()

  return (
    <select
      value={result ? result.id : '-'}
      onChange={(event) => {
        const { value } = event.currentTarget
        if (value === '-') {
          return router.push(`/journeys/wordle`)
        }

        router.push(`/journeys/wordle/${value}`)
      }}
    >
      <option>-</option>
      {list.map((item) => (
        <option key={idficationTitle(item.title)} value={item.id}>
          {item.title}
        </option>
      ))}
    </select>
  )
}
