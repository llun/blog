'use client'

import React, { FC, useEffect } from 'react'

import { Result } from '../../../../libs/wordle'
import { setResultToClipboard } from './setResultToClipboard'
import style from './wordle.module.css'

interface Props {
  result?: Result | null
}

export const CopierIcon: FC<Props> = ({ result }) => {
  useEffect(() => {
    setResultToClipboard(result)
  })
  return (
    <span
      className={style.copy}
      title="Copy"
      onClick={() => setResultToClipboard(result)}
    >
      📋
    </span>
  )
}
