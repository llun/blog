import React from 'react'

import { englishResults } from '../../../../libs/wordle'
import { MainContent } from './MainContent'

const WordlesPage = async () => {
  const results = await englishResults()
  results.reverse()
  return <MainContent list={results} />
}

export default WordlesPage
