import React, { ReactNode } from 'react'

import Header from '../../components/Header'
import { getConfig } from '../../libs/blog'

import { Metadata } from 'next'
import { getMetadata } from '../../components/Meta'
import { Modal } from '../../components/Modal'
import '../../public/css/index.css'

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
