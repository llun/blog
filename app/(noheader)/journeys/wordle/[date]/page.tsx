import React, { FC } from 'react'

import { englishResult, englishResults } from '../../../../../libs/wordle'
import { MainContent } from '../MainContent'

interface Props {
  params: Promise<{
    date: string
  }>
}

export const generateStaticParams = async () => {
  const results = await englishResults()
  return results.map((result) => ({
    date: result.id
  }))
}

const WordlePage: FC<Props> = async ({ params }) => {
  const { date } = await params
  const [list, result] = await Promise.all([
    englishResults(),
    englishResult(date)
  ])
  list.reverse()

  return <MainContent result={result} list={list} />
}

export default WordlePage
