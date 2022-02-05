import type { GetStaticPropsContext } from 'next'

import Link from 'next/link'
import path from 'path'

import { Journey } from '../../journey'
import { getConfig, Config } from '../../blog'
import Meta from '../../components/Meta'
import style from './wordle.module.css'

interface Result {
  title: string
  guesses: {
    result: string
    word: string
  }[]
}

export async function getStaticProps() {
  const config = getConfig()
  const results: Result[] = [
    {
      title: 'Wordle 229 5/6',
      guesses: [
        { result: '⬜⬜⬜⬜⬜', word: 'union' },
        { result: '🟨⬜⬜⬜⬜', word: 'apple' },
        { result: '⬜🟨⬜⬜⬜', word: 'tally' },
        { result: '🟩⬜🟩⬜⬜', word: 'smack' },
        { result: '🟩🟩🟩🟩🟩', word: 'shard' }
      ]
    },
    {
      title: 'Wordle 230 6/6',
      guesses: [
        { result: '⬜⬜🟨⬜🟨', word: 'shade' },
        { result: '🟨🟨⬜🟨🟨', word: 'apple' },
        { result: '🟩🟨🟨⬜🟨', word: 'pearl' },
        { result: '🟩🟩🟩🟩⬜', word: 'pleas' },
        { result: '🟩🟩🟩🟩⬜', word: 'plead' },
        { result: '🟩🟩🟩🟩🟩', word: 'pleat' }
      ]
    },
    {
      title: 'Wordle 231 4/6',
      guesses: [
        { result: '⬜🟨🟨🟨⬜', word: 'roate' },
        { result: '⬜🟨🟨⬜🟩', word: 'toast' },
        { result: '🟩⬜🟩⬜🟩', word: 'about' },
        { result: '🟩🟩🟩🟩🟩', word: 'aloft' }
      ]
    }
  ]

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
      <main>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
        <div className={style.content}>
          <h1>Wordle</h1>
          <p>A record of my wordle results</p>

          <ul>
            {results.map((item) => (
              <li key={item.title}>
                <a
                  href={`#${item.title
                    .toLocaleLowerCase()
                    .substring(7)
                    .replace(/\s+/g, '-')}`}
                  onClick={(e) => setResultToClipboard(item)}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          {results.map((item) => (
            <div
              id={`${item.title
                .toLocaleLowerCase()
                .substring(7)
                .replace(/\s+/g, '-')}`}
              className={style.guess}
              key={`guesses-${item.title}`}
            >
              <h2>Result</h2>
              {item.guesses.map((guess, index) => (
                <div className={style.row} key={`guess-${item.title}-${index}`}>
                  {guess.result}
                </div>
              ))}
            </div>
          ))}
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
