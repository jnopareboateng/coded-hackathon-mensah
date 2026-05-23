'use client'

import Image from 'next/image'
import Link from 'next/link'
import { use, useState } from 'react'
import { Minus, Plus, Share2, Check } from 'lucide-react'
import { useItem } from '@/lib/queries'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: item, isLoading, isError } = useItem(id)
  const { add, openCart } = useCartStore()
  const [qty, setQty] = useState(1)
  const [shared, setShared] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-12 w-full mt-8" />
        </div>
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-stone-500">Product not found.</p>
        <Link
          href="/shop"
          className="text-xs tracking-widest uppercase underline mt-4 inline-block"
        >
          Back to Shop
        </Link>
      </div>
    )
  }

  const imageUrl = item.image_urls?.[0] ?? ''

  function handleAdd() {
    if (!item) return
    add({
      item_id: item.id,
      name: item.name,
      price_minor: item.price_minor,
      image_url: imageUrl,
      qty,
    })
    openCart()
  }

  async function handleShare() {
    const url = window.location.href
    const text = `${item!.name} — ${formatPrice(item!.price_minor)} | Mensah Atelier`
    if (navigator.share) {
      try {
        await navigator.share({ title: item!.name, text, url })
      } catch {
        // dismissed
      }
    } else {
      await navigator.clipboard.writeText(url)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative aspect-[3/4] bg-stone-100">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        {!item.in_stock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Badge variant="outline" className="text-xs tracking-widest">
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center space-y-6">
        <div>
          <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-2">Mensah Atelier</p>
          <h1 className="font-serif text-3xl text-stone-900">{item.name}</h1>
          <p className="text-xl text-stone-600 mt-3">{formatPrice(item.price_minor)}</p>
        </div>

        <p className="text-sm text-stone-500 leading-relaxed">
          {item.description ??
            'Precision-tailored to the highest standard. Each piece from Mensah Atelier is crafted for the modern gentleman.'}
        </p>

        {/* Qty selector */}
        {item.in_stock && (
          <div className="flex items-center gap-0">
            <span className="text-xs tracking-widest uppercase text-stone-400 mr-4">Qty</span>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-12 h-10 border-t border-b border-stone-200 flex items-center justify-center text-sm">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={!item.in_stock}
          className="py-4 bg-stone-900 text-white text-xs tracking-widest uppercase hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {item.in_stock ? `Add ${qty > 1 ? `${qty} ` : ''}to Cart` : 'Sold Out'}
        </button>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <Link
            href="/shop"
            className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors"
          >
            ← Back to Collection
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            {shared ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
