'use client'

import React, { FC, useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { Result } from '../../../../libs/wordle'
import { idficationTitle } from './DateSelector'

export const tileClassname = (char: string) => {
  switch (char) {
    case '🟨':
      return 'bg-yellow-500'
    case '🟩':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

export const ResultBlock: FC<{
  result?: Result | null
}> = ({ result }) => {
  const [showWords, setShowWords] = useState<boolean>(false)

  if (!result) return null

  return (
    <div
      id={`${idficationTitle(result.title)}`}
      className="block mt-4"
      key={`guesses-${idficationTitle(result.title)}`}
    >
      <h2 className="mb-2">
        {result.title}{' '}
        <span
          className="cursor-pointer ml-2"
          onClick={() => setShowWords(!showWords)}
        >
          {showWords ? (
            <Eye className="w-5 h-5 inline" />
          ) : (
            <EyeClosed className="w-5 h-5 inline" />
          )}
        </span>
      </h2>

      {result.guesses.map((guess, index) => (
        <div key={`tile-${index}`} className="mb-2">
          {[...guess.result].map((char, index) => (
            <span
              key={`char-${index}`}
              className={`wordle-block ${tileClassname(char)}`}
            >
              <span className={showWords ? 'visible' : 'invisible'}>
                {guess.word[index]}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
