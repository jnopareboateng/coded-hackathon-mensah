'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api-hackathon.codedematrixtech.com'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/campaigns', label: 'Campaigns' },
]

export function Navbar() {
  const { totalItems, openCart } = useCartStore()
  const count = totalItems()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf8]/95 backdrop-blur border-b border-stone-200">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
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
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-widest text-stone-500 uppercase hover:text-stone-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
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

          <button
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 cursor-pointer"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#fafaf8] py-4 px-6 flex flex-col gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-xs tracking-widest uppercase text-stone-700 hover:text-stone-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
