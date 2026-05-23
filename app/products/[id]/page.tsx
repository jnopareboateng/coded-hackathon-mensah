'use client'

import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { useItem } from '@/lib/queries'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: item, isLoading, isError } = useItem(id)
  const { add, openCart } = useCartStore()

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
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
      qty: 1,
    })
    openCart()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="relative aspect-[3/4] bg-stone-100">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover"
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

        <button
          onClick={handleAdd}
          disabled={!item.in_stock}
          className="py-4 bg-stone-900 text-white text-xs tracking-widest uppercase hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {item.in_stock ? 'Add to Cart' : 'Sold Out'}
        </button>

        <Link
          href="/shop"
          className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors"
        >
          ← Back to Collection
        </Link>
      </div>
    </div>
  )
}
