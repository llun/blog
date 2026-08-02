'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Laptop } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [showModal, setShowModal] = useState(false)
  // next-themes resolves the theme after mount, so the icon can only be
  // rendered on the client without mismatching the server markup
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  // Closing while focus sits on an option would unmount the focused element
  // and drop focus to the body, restarting tab order from the top
  const close = useCallback(() => {
    setShowModal(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!showModal) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showModal, close])

  const getCurrentIcon = () => {
    if (!mounted) return <span className="block h-4 w-4" aria-hidden="true" />

    switch (theme) {
      case 'light':
        return <Sun size={16} />
      case 'dark':
        return <Moon size={16} />
      default:
        return <Laptop size={16} />
    }
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setShowModal(!showModal)}
        className="theme-toggle"
        aria-label="Toggle theme"
        aria-expanded={showModal}
        aria-controls="theme-options"
      >
        {getCurrentIcon()}
      </button>

      {showModal && (
        <>
          <div
            className="theme-toggle-modal"
            onClick={close}
            aria-hidden="true"
          />
          <div className="theme-toggle-modal-content">
            <div
              className="theme-toggle-modal-button-container"
              id="theme-options"
              role="group"
              aria-label="Theme"
            >
              <button
                onClick={() => {
                  setTheme('light')
                  close()
                }}
                className={cn('theme-toggle-modal-button', {
                  'theme-toggle-modal-button-selected': theme === 'light'
                })}
                aria-label="Light mode"
                aria-pressed={theme === 'light'}
              >
                <Sun size={16} />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setTheme('dark')
                  close()
                }}
                className={cn('theme-toggle-modal-button', {
                  'theme-toggle-modal-button-selected': theme === 'dark'
                })}
                aria-label="Dark mode"
                aria-pressed={theme === 'dark'}
              >
                <Moon size={16} />
                <span>Dark</span>
              </button>
              <button
                onClick={() => {
                  setTheme('system')
                  close()
                }}
                className={cn('theme-toggle-modal-button', {
                  'theme-toggle-modal-button-selected': theme === 'system'
                })}
                aria-label="System preference"
                aria-pressed={theme === 'system'}
              >
                <Laptop size={16} />
                <span>System</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
