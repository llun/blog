import { GetStaticProps } from 'next'

import { getConfig, Config } from '../../../libs/blog'
import { Calendar, getAllCalendars } from '../../../libs/amsterdam'
import { AmsterdamPage } from './[calendar]'

interface Props {
  config: Config
  calendars: Calendar[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const config = getConfig()
  const calendars = await getAllCalendars()
  return {
    props: {
      config,
      calendars
    }
  }
}

export default AmsterdamPage
