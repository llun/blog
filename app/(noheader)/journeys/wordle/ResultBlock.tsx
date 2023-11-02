'use client'

import React, { FC, useState } from 'react'

import { Result } from '../../../../libs/wordle'
import { idficationTitle } from './DateSelector'
import style from './wordle.module.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tileClassname = (style: any, char: string) => {
  switch (char) {
    case '🟨':
      return style.guessPresent
    case '🟩':
      return style.guessCorrect
    default:
      return style.guessAbsent
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
      className={style.guess}
      key={`guesses-${idficationTitle(result.title)}`}
    >
      <h2>
        {result.title}{' '}
        <span
          className={style.reviewIcon}
          onClick={() => setShowWords(!showWords)}
        >
          {showWords ? '🙊' : '🙈'}
        </span>
      </h2>

      {result.guesses.map((guess, index) => (
        <div key={`tile-${index}`} className={style.tile}>
          {[...guess.result].map((char, index) => (
            <span
              key={`char-${index}`}
              className={`${style.guessBlock} ${tileClassname(style, char)}`}
            >
              <span className={showWords ? style.visible : style.invisible}>
                {guess.word[index]}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
