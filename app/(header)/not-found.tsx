import Link from 'next/link'
import React from 'react'
import { ArrowLeft } from 'lucide-react'

const NotFound = () => (
  <section className="my-16 text-center">
    <h1 className="post-title">Page not found</h1>
    <p className="text-muted-foreground">
      The page you are looking for does not exist or has moved.
    </p>
    <Link className="post-header-back-link" href="/">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Home
    </Link>
  </section>
)

export default NotFound
