'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] tracking-[0.55em] uppercase text-stone-300 mb-8">Error</p>
      <h2 className="font-serif text-4xl text-stone-900 mb-4">Something went wrong</h2>
      <div className="w-10 h-px bg-stone-200 my-6" />
      <p className="text-sm text-stone-500 mb-10 max-w-[30ch] leading-relaxed">
        We couldn&apos;t load this page. Please try again or return to the collection.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-8 py-3 bg-stone-900 text-white text-[11px] tracking-[0.28em] uppercase hover:bg-stone-700 transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-3 border border-stone-200 text-[11px] tracking-[0.28em] uppercase text-stone-500 hover:border-stone-900 hover:text-stone-900 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
