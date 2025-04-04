import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import React, { ReactNode } from 'react'

import { getConfig } from '../../libs/blog'
import Header from '../../components/Header'
import { getMetadata } from '../../components/Meta'
import { Modal } from '../../components/Modal'

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
  initialScale: 1
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
          <div className="layout-div">
            <Header title={title} url={url} />
            <main className="main-container">{children}</main>
          </div>
          <Modal />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
