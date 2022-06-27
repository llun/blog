import path from 'path'
import fs from 'fs/promises'

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

export const englishResult = async (date: string) => {
  const content = await fs.readFile(
    path.join(process.cwd(), 'contents', 'wordle', 'en', `${date}.json`),
    'utf-8'
  )
  return {
    ...JSON.parse(content),
    id: date
  } as Result
}
