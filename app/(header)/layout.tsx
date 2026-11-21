import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import React, { ReactNode } from 'react'

import { getConfig } from '../../libs/blog'
import { HOME_DESCRIPTION, HOME_TITLE } from '../../libs/seo'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { getMetadata } from '../../components/Meta'

import '../fonts/fonts.css'
import '../../public/css/globals.css'

const config = getConfig()
const { url } = config

// Fallback for pages without their own metadata (error pages); every page
// sets its own title, description and canonical URL
export const metadata: Metadata = getMetadata({
  url,
  title: HOME_TITLE,
  description: HOME_DESCRIPTION
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
