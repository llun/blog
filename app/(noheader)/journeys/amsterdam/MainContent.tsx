import Link from 'next/link'
import React, { FC } from 'react'

import { Calendar } from '../../../../libs/amsterdam'

import { CalendarSelector } from './CalendarSelector'
import style from './amsterdam.module.css'

interface Props {
  calendars: Calendar[]
  currentCalendar?: Calendar | null
}

export const MainContent: FC<Props> = ({ currentCalendar, calendars }) => {
  return (
    <main className={style.amsterdam}>
      <p>
        <Link href="/journeys">← Journeys</Link>
      </p>
      <h1>Amsterdam</h1>
      <p>
        ตอนย้ายมาอยู่สิงคโปร์ไม่ได้จดเก็บไว้ รอบนี้กำลังจะไปอยู่ Amsterdam
        เลยได้โอกาสจดเป็น Journey ยาวเก็บไว้ตั้งแต่ต้น title
        อาจจะเปลี่ยนถ้าอยู่มากกว่า Amsterdam แต่เริ่มต้นไว้แบบนี้ก่อน
      </p>

      <div className={style.navigation}>
        <CalendarSelector
          calendars={calendars}
          currentCalendar={currentCalendar}
        />
      </div>

      {currentCalendar && (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: currentCalendar.content || '' }}
          />
        </>
      )}
      <p>
        <Link href="/journeys">← Journeys</Link>
      </p>
    </main>
  )
}
