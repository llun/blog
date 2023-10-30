import React, { ReactNode } from 'react'

import Header from '../components/Header'
import { getConfig } from '../libs/blog'

import { Modal } from '../components/Modal'
import '../public/css/index.css'

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
    <html lang="en">
      <body>
        <Header title={title} url={url} />
        {children}
        <Modal />
      </body>
    </html>
  )
}

export default RootLayout
