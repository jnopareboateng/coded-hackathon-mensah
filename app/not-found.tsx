import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found — Mensah Atelier',
}

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] tracking-[0.55em] uppercase text-stone-300 mb-8">404</p>
      <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-4 leading-none">
        Not Found
      </h1>
      <div className="w-10 h-px bg-stone-200 my-6" />
      <p className="text-sm text-stone-500 mb-10 max-w-[28ch] leading-relaxed">
        This piece has moved or no longer exists. Let&apos;s get you back to the collection.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/shop"
          className="px-8 py-3 bg-stone-900 text-white text-[11px] tracking-[0.28em] uppercase hover:bg-stone-700 transition-colors"
        >
          Browse Collection
        </Link>
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
