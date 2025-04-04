'use client'

import React, { FC, useEffect } from 'react'
import { Copy } from 'lucide-react'

import { Result } from '../../../../libs/wordle'
import { setResultToClipboard } from './setResultToClipboard'

interface Props {
  className?: string
  result?: Result | null
}

export const CopierIcon: FC<Props> = ({ result, className }) => {
  useEffect(() => {
    setResultToClipboard(result)
  })
  return (
    <span
      className={`cursor-pointer ${className}`}
      title="Copy"
      onClick={() => setResultToClipboard(result)}
    >
      <Copy className="w-5 h-5 inline" />
    </span>
  )
}
