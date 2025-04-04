'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Laptop } from 'lucide-react'
import React, { useState } from 'react'
import cn from 'classnames'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [showModal, setShowModal] = useState(false)

  const getCurrentIcon = () => {
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
        onClick={() => setShowModal(!showModal)}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        {getCurrentIcon()}
      </button>

      {showModal && (
        <>
          <div
            className="theme-toggle-modal"
            onClick={() => setShowModal(false)}
          />
          <div className="theme-toggle-modal-content">
            <div className="theme-toggle-modal-button-container">
              <button
                onClick={() => {
                  setTheme('light')
                  setShowModal(false)
                }}
                className={cn('theme-toggle-modal-button', {
                  'theme-toggle-modal-button-selected': theme === 'light'
                })}
                aria-label="Light mode"
              >
                <Sun size={16} />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setTheme('dark')
                  setShowModal(false)
                }}
                className={cn('theme-toggle-modal-button', {
                  'theme-toggle-modal-button-selected': theme === 'dark'
                })}
                aria-label="Dark mode"
              >
                <Moon size={16} />
                <span>Dark</span>
              </button>
              <button
                onClick={() => {
                  setTheme('system')
                  setShowModal(false)
                }}
                className={cn('theme-toggle-modal-button', {
                  'theme-toggle-modal-button-selected': theme === 'system'
                })}
                aria-label="System preference"
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
