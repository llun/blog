import path from 'path'
import fs from 'fs/promises'

import { isSafeSegment } from './utils'

export interface ResultKey {
  id: string
  title: string
}

export interface Result extends ResultKey {
  word: string
  guesses: {
    result: string
    word: string
  }[]
}

export const englishResults = async () => {
  const resultPath = path.join(process.cwd(), 'contents', 'wordle', 'en')
  const files = await fs.readdir(resultPath)
  return Promise.all(
    files.map(async (fileName) =>
      fs.readFile(path.join(resultPath, fileName), { encoding: 'utf-8' }).then(
        (data) =>
          ({
            ...JSON.parse(data),
            id: path.basename(fileName, '.json')
          } as Result)
      )
    )
  )
}

export const englishResult = async (date: string): Promise<Result | null> => {
  if (!isSafeSegment(date)) {
    return null
  }

  const file = path.join(process.cwd(), 'contents', 'wordle', 'en', `${date}.json`)
  let content: string
  try {
    content = await fs.readFile(file, 'utf-8')
  } catch {
    return null
  }

  try {
    return {
      ...JSON.parse(content),
      id: date
    } as Result
  } catch (error) {
    console.warn(`Unable to parse wordle result ${file}`, error)
    return null
  }
}
