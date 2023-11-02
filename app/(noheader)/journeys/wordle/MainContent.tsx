import Link from 'next/link'
import React, { FC } from 'react'

import { Result } from '../../../../libs/wordle'
import { CopierIcon } from './CopierIcon'
import { DateSelector } from './DateSelector'
import { ResultBlock } from './ResultBlock'
import style from './wordle.module.css'

interface Props {
  list: Result[]
  result?: Result | null
}

export const MainContent: FC<Props> = ({ list, result }) => {
  return (
    <main className={style.wordle}>
      <p>
        <Link href="/journeys">← Journeys</Link>
      </p>
      <div className={style.content}>
        <h1>Wordle</h1>
        <p>
          A record of my{' '}
          <Link
            href="https://www.nytimes.com/games/wordle/index.html"
            target="_blank"
          >
            Wordle
          </Link>{' '}
          results
        </p>

        <DateSelector list={list} result={result} />
        <CopierIcon result={result} />
        <ResultBlock result={result} />
      </div>
      <p>
        <Link href="/journeys">← Journeys</Link>
      </p>
    </main>
  )
}
