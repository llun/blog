import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { GetStaticPaths, GetStaticProps } from 'next'

import { getConfig, Config } from '../../../libs/blog'
import Meta from '../../../components/Meta'
import { Calendar, getAllCalendars, getCalendar } from '../../../libs/amsterdam'
import style from './[calendar].module.css'

interface Props {
  config: Config
  calendars: Calendar[]
  current?: Calendar | null
}

interface Params extends ParsedUrlQuery {
  calendar: string
}

const getCalendarTitle = (calendar: Calendar) =>
  `${[calendar.month[0].toLocaleUpperCase(), calendar.month.slice(1)].join(
    ''
  )} ${calendar.year}`

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const calendars = await getAllCalendars()
  return {
    paths: calendars.map((calendar) => ({
      params: { calendar: calendar.id }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const config = getConfig()
  const calendars = await getAllCalendars()
  const { params } = context
  if (!params) {
    return {
      props: {
        config,
        calendars
      }
    }
  }

  const { calendar } = params
  return {
    props: {
      config,
      calendars,
      current: await getCalendar(calendar)
    }
  }
}

export const AmsterdamPage = ({ config, calendars, current }: Props) => {
  const router = useRouter()
  const { title, url } = config

  useEffect(() => {
    for (const month of calendars) {
      router.prefetch(`/journeys/amsterdam/${month.id}`)
    }
  })

  return (
    <>
      <Meta
        title={`${title}, Amsterdam`}
        description="New life chapter, Singapore 👉 Amsterdam"
        url={`${url}/journeys/amsterdam`}
      />
      <main className={style.amsterdam}>
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
        <h1>Amsterdam</h1>
        <p>
          ตอนย้ายมาอยู่สิงคโปร์ไม่ได้จดเก็บไว้ รอบนี้กำลังจะไปอยู่ Amsterdam
          เลยได้โอกาสจดเป็น Journey ยาวเก็บไว้ตั้งแต่ต้น title
          อาจจะเปลี่ยนถ้าอยู่มากกว่า Amsterdam แต่เริ่มต้นไว้แบบนี้ก่อน
        </p>
        <select
          value={current?.id ?? '-'}
          onChange={(event) => {
            const { value } = event.currentTarget
            if (value === '-') {
              return router.push(`/journeys/amsterdam`)
            }
            router.push(`/journeys/amsterdam/${value}`)
          }}
        >
          <option>-</option>
          {calendars.map((calendar) => {
            return (
              <option key={calendar.id} value={calendar.id}>
                {getCalendarTitle(calendar)}
              </option>
            )
          })}
        </select>
        {current && (
          <>
            <div dangerouslySetInnerHTML={{ __html: current.content || '' }} />
          </>
        )}
        <p>
          <Link href="/journeys">
            <a>← Journeys</a>
          </Link>
        </p>
      </main>
    </>
  )
}
export default AmsterdamPage
