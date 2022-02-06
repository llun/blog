import Link from 'next/link'
import fs from 'fs/promises'
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

async function englishResults(): Promise<Result[]> {
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
  ).map((data) => JSON.parse(data))
}

export async function getStaticProps() {
  const config = getConfig()
  const results: Result[] = await englishResults()
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

  const idficationTitle = (title: string) =>
    title.toLocaleLowerCase().substring(7).replace(/\s+/g, '-')

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
          <p>
            A record of my{' '}
            <Link href="https://www.powerlanguage.co.uk/wordle/">
              <a target="_blank">Wordle</a>
            </Link>{' '}
            results
          </p>

          <ul>
            {results.map((item) => (
              <li key={item.title}>
                <a
                  href={`#${idficationTitle(item.title)}`}
                  onClick={(e) => setResultToClipboard(item)}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          {results.map((item) => (
            <div
              id={`${idficationTitle(item.title)}`}
              className={style.guess}
              key={`guesses-${idficationTitle(item.title)}`}
            >
              <h2>{item.title}</h2>
              {item.guesses.map((guess, index) => (
                <div className={style.row} key={`guess-${index}`}>
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
