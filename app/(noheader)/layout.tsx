import React, { ReactNode } from 'react'

import '../../public/css/index.css'

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
