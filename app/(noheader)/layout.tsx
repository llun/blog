import { Metadata } from 'next'
import React, { ReactNode } from 'react'

import { getMetadata } from '../../components/Meta'
import { getConfig } from '../../libs/blog'
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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
