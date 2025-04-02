import React, { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import Header from '../../components/Header'
import { getConfig } from '../../libs/blog'

import { Metadata } from 'next'
import { getMetadata } from '../../components/Meta'
import { Modal } from '../../components/Modal'

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
  initialScale: 1
}

interface Props {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  const { title, url } = getConfig()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Header title={title} url={url} />
            <main className="container mx-auto max-w-5xl flex-1 px-4 py-8">
              {children}
            </main>
          </div>
          <Modal />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
