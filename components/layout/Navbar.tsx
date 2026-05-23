'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api-hackathon.codedematrixtech.com'

export function Navbar() {
  const { totalItems, openCart } = useCartStore()
  const count = totalItems()

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf8]/95 backdrop-blur border-b border-stone-200">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={`${BASE}/images/mensah/logo.png`}
            alt="Mensah"
            width={32}
            height={32}
            className="object-contain"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <span className="font-serif text-lg tracking-[0.25em] text-stone-900 uppercase">
            Mensah
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/shop"
            className="text-xs tracking-widest text-stone-500 uppercase hover:text-stone-900 transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/campaigns"
            className="text-xs tracking-widest text-stone-500 uppercase hover:text-stone-900 transition-colors"
          >
            Campaigns
          </Link>
        </div>

        <button
          onClick={openCart}
          className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label={`Open cart, ${count} items`}
        >
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-stone-900 text-white text-[10px] flex items-center justify-center rounded-full">
              {count}
            </span>
          )}
        </button>
      </nav>
    </header>
  )
}
