'use client'

import Link from 'next/link'
import React from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorBoundary = ({ error, reset }: Props) => (
  <main className="main-container">
    <section className="my-16 text-center">
      <h1 className="post-title">Something went wrong</h1>
      <p className="text-muted-foreground">
        Sorry, this page could not be loaded. Please try again.
      </p>
      {error.digest && (
        <p className="text-muted-foreground text-sm">
          Reference {error.digest}
        </p>
      )}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          className="key key-primary"
          onClick={() => reset()}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
        <Link className="key" href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Home
        </Link>
      </div>
    </section>
  </main>
)

export default ErrorBoundary
