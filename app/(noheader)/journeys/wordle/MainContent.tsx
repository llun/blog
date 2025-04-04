import Link from 'next/link'
import React, { FC } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Result } from '../../../../libs/wordle'
import { CopierIcon } from './CopierIcon'
import { DateSelector } from './DateSelector'
import { ResultBlock } from './ResultBlock'
import { ThemeToggle } from '../../../../components/ThemeToggle'

interface Props {
  list: Result[]
  result?: Result | null
}

export const MainContent: FC<Props> = ({ list, result }) => {
  return (
    <main className="main-container">
      <div className="post-header">
        <Link className="post-header-back-link" href="/journeys">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Journeys
        </Link>
        <ThemeToggle />
      </div>

      <div className="content">
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
        <CopierIcon className="ml-4" result={result} />
        <ResultBlock result={result} />
      </div>
      <Link className="post-header-back-link mt-4" href="/journeys">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Journeys
      </Link>
    </main>
  )
}
