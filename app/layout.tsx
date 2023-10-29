import React from 'react'

import Header from '../components/Header'
import { getConfig } from '../libs/blog'

import '../public/css/index.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { title, url } = getConfig()

  return (
    <html lang="en">
      <body>
        <Header title={title} url={url} />
        {children}
        {/* <Modal /> */}
      </body>
    </html>
  )
}
