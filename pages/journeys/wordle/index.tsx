import { GetStaticProps } from 'next'
import { getConfig } from '../../../libs/blog'
import { englishResults, Result } from '../../../libs/wordle'
import { Props, WordlePage } from './[date]'

export const getStaticProps: GetStaticProps<Props> = async () => {
  const config = getConfig()
  const results: Result[] = await englishResults()
  results.reverse()
  return {
    props: {
      config,
      list: results.map((result) => ({ id: result.id, title: result.title }))
    }
  }
}

export default WordlePage
