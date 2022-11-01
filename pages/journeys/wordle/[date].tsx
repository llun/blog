import Link from 'next/link'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import { ParsedUrlQuery } from 'querystring'

import { getConfig, Config } from '../../../libs/blog'
import {
  englishResult,
  englishResults,
  Result,
  ResultKey
} from '../../../libs/wordle'
import Meta from '../../../components/Meta'

import style from './[date].module.css'
import { useRouter } from 'next/router'

interface Params extends ParsedUrlQuery {
  date: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const results = await englishResults()
  return {
    paths: results.map((result) => ({
      params: {
        date: result.id
      }
    })),
    fallback: false
  }
}

export interface Props {
  config: Config
  list: ResultKey[]
  result?: Result
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => {
  if (!params) {
    return {
      notFound: true
    }
  }

  const { date } = params
  const config = getConfig()
  const results: Result[] = await englishResults()
  results.reverse()
  return {
    props: {
      config,
      list: results.map((result) => ({ id: result.id, title: result.title })),
      result: await englishResult(date)
    }
  }
}

export const idficationTitle = (title: string) =>
  title.toLocaleLowerCase().substring(7).replace(/\s+/g, '-')

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

const setResultToClipboard = async (result?: Result) => {
  if (!result) return

  const text = `
${result.title}

${result.guesses.map((guess) => guess.result).join('\n')}

${window.location}
`.trim()

  const blob = new Blob([text], { type: 'text/plain' })
  const data = [new window.ClipboardItem({ 'text/plain': blob })]
  await navigator.clipboard.write(data)
}

const ResultBlock: FC<{
  showWords: boolean
  setShowWords: (value: SetStateAction<boolean>) => void
  result?: Result
}> = ({ showWords, setShowWords, result }) => {
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

export const WordlePage: NextPage<Props> = ({ config, list, result }) => {
  const { title, url } = config
  const router = useRouter()
  const [showWords, setShowWords] = useState<boolean>(false)

  useEffect(() => {
    setResultToClipboard(result)
  })

  return (
    <>
      <Meta
        title={`${title}, Wordle`}
        description="Just my wordle journey each day"
        url={`${url}/journeys/wordle`}
      />
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
          <span
            className={style.copy}
            title="Copy"
            onClick={() => setResultToClipboard(result)}
          >
            📋
          </span>

          <ResultBlock
            showWords={showWords}
            setShowWords={setShowWords}
            result={result}
          />
        </div>
        <p>
          <Link href="/journeys">← Journeys</Link>
        </p>
      </main>
    </>
  )
}
export default WordlePage
