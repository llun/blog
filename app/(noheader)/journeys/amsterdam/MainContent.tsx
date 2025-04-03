import Link from 'next/link'
import React, { FC } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Calendar } from '../../../../libs/amsterdam'
import { ThemeToggle } from '../../../../components/ThemeToggle'
import { CalendarSelector } from './CalendarSelector'
import style from './amsterdam.module.css'

interface Props {
  calendars: Calendar[]
  currentCalendar?: Calendar | null
}

export const MainContent: FC<Props> = ({ currentCalendar, calendars }) => {
  return (
    <main className="main-container">
      <div className="post-header">
        <Link className="post-header-back-link" href="/journeys">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Journeys
        </Link>
        <ThemeToggle />
      </div>

      <h1 className="mb-4">Amsterdam</h1>
      <p className="mb-4">
        ตอนย้ายมาอยู่สิงคโปร์ไม่ได้จดเก็บไว้ รอบนี้กำลังจะไปอยู่ Amsterdam
        เลยได้โอกาสจดเป็น Journey ยาวเก็บไว้ตั้งแต่ต้น title
        อาจจะเปลี่ยนถ้าอยู่มากกว่า Amsterdam แต่เริ่มต้นไว้แบบนี้ก่อน
      </p>

      <div className="mb-4">
        <CalendarSelector
          calendars={calendars}
          currentCalendar={currentCalendar}
        />
      </div>

      {currentCalendar && (
        <>
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: currentCalendar.content || '' }}
          />
        </>
      )}

      <Link className="post-header-back-link" href="/journeys">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Journeys
      </Link>
    </main>
  )
}
