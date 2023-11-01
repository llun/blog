import { Metadata } from 'next'
import { ReactNode } from 'react'

import { getMetadata } from '../../../../components/Meta'
import { getConfig } from '../../../../libs/blog'

const config = getConfig()
const { title, url } = config

export const metadata: Metadata = getMetadata({
  url,
  title: `${title}, Amsterdam`,
  description: `New life chapter, Singapore 🇸🇬 👉 Amsterdam 🇳🇱`
})

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return children
}

export default Layout
