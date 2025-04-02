import { Metadata } from 'next'
import React, { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

import { getMetadata } from '../../components/Meta'
import { getConfig } from '../../libs/blog'

import '../../public/css/index.css'
import '../../public/css/globals.css'

const config = getConfig()
const { title, description, url } = config

export const metadata: Metadata = getMetadata({
  url,
  title,
  description
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}
interface Props {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="layout-div">
            <main className="main-container">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
