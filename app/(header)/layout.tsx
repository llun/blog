import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import React, { ReactNode } from 'react'

import { getConfig } from '../../libs/blog'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { getMetadata } from '../../components/Meta'

import '../fonts/fonts.css'
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
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0b' }
  ]
}

interface Props {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  const { title, url } = getConfig()

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div id="app-root" className="layout-div">
            <Header title={title} url={url} />
            <main className="main-container">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
