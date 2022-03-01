import Link from 'next/link'
import fs from 'fs/promises'
import path from 'path'
import { useState } from 'react'

import { Journey } from '../../journey'
import { getConfig, Config } from '../../blog'
import Meta from '../../components/Meta'
import style from './wordle.module.css'

interface Result {
  title: string
  word: string
  guesses: {
    result: string
    word: string
  }[]
}

const englishResults = async () => {
  const resultPath = path.join(
    process.cwd(),
    'pages',
    'journeys',
    'wordle',
    'en'
  )
  const files = await fs.readdir(resultPath)
  return (
    await Promise.all(
      files.map(async (fileName) =>
        fs.readFile(path.join(resultPath, fileName), { encoding: 'utf-8' })
      )
    )
  ).map((data) => JSON.parse(data) as Result)
}

const idficationTitle = (title: string) =>
  title.toLocaleLowerCase().substring(7).replace(/\s+/g, '-')

const tileClassname = (char: string) => {
  switch (char) {
    case '🟨':
      return style.guessPresent
    case '🟩':
      return style.guessCorrect
    default:
      return style.guessAbsent
  }
}

export async function getStaticProps() {
  const config = getConfig()
  const results: Result[] = await englishResults()
  results.reverse()
  return {
    props: {
      config,
      results
    }
  }
}

interface Props {
  config: Config
  results: Result[]
}

const Journey = ({ config, results }: Props) => {
  const { title, url } = config
  const [showWords, setShowWords] = useState<boolean>(false)
  const [currentWord, setCurrentWord] = useState<Result>(null)

  const setResultToClipboard = async (result: Result) => {
    const text = `
${result.title}

${result.guesses.map((guess) => guess.result).join('\n')}

${window.location}
`.trim()

    const blob = new Blob([text], { type: 'text/plain' })
    const data = [new ClipboardItem({ 'text/plain': blob })]
    await navigator.clipboard.write(data)
  }

  return (
    <>
      <Meta
        title={`${title}, Wordle`}
        description="Just my wordle journey each day"
        url={`${url}/journeys/wordle`}
      />
      <main className={style.wordle}>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
        <div className={style.content}>
          <h1>Wordle</h1>
          <p>
            A record of my{' '}
            <Link href="https://www.nytimes.com/games/wordle/index.html">
              <a target="_blank">Wordle</a>
            </Link>{' '}
            results
          </p>

          <select
            onChange={(e) => {
              const value = e.currentTarget.value
              if (value === '-') {
                setCurrentWord(null)
                return
              }

              const item = results[value]
              setResultToClipboard(item)
              setCurrentWord(item)
            }}
          >
            <option>-</option>
            {results.map((item, index) => (
              <option key={idficationTitle(item.title)} value={index}>
                {item.title}
              </option>
            ))}
          </select>

          {currentWord && (
            <div
              id={`${idficationTitle(currentWord.title)}`}
              className={style.guess}
              key={`guesses-${idficationTitle(currentWord.title)}`}
            >
              <h2>
                {currentWord.title}{' '}
                <span
                  className={style.reviewIcon}
                  onClick={() => setShowWords(!showWords)}
                >
                  {showWords ? '🙊' : '🙈'}
                </span>
              </h2>

              {currentWord.guesses.map((guess, index) => (
                <div key={`tile-${index}`} className={style.tile}>
                  {[...guess.result].map((char, index) => (
                    <span
                      key={`char-${index}`}
                      className={`${style.guessBlock} ${tileClassname(char)}`}
                    >
                      <span
                        className={showWords ? style.visible : style.invisible}
                      >
                        {guess.word[index]}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
      </main>
    </>
  )
}
export default Journey
