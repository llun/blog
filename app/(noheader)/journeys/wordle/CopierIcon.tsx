'use client'

import React, { FC, useCallback, useEffect } from 'react'
import { Copy } from 'lucide-react'

import { Result } from '../../../../libs/wordle'
import { setResultToClipboard } from './setResultToClipboard'

interface Props {
  className?: string
  result?: Result | null
}

export const CopierIcon: FC<Props> = ({ result, className }) => {
  const copyResult = useCallback(() => {
    setResultToClipboard(result).catch((error) => {
      // Rejected without a user gesture, or when ClipboardItem is unavailable
      console.warn('Unable to copy wordle result', error)
    })
  }, [result])

  useEffect(() => {
    copyResult()
  }, [copyResult])

  return (
    <span
      className={`cursor-pointer ${className}`}
      title="Copy"
      onClick={copyResult}
    >
      <Copy className="w-5 h-5 inline" />
    </span>
  )
}
