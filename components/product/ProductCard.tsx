'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import type { Item } from '@/types/api'

interface Props {
  item: Item
  variant?: 'default' | 'large' | 'small'
}

export function ProductCard({ item, variant = 'default' }: Props) {
  const { add, openCart } = useCartStore()
  const imageUrl = item.image_urls?.[0] ?? ''

  const aspectClass =
    variant === 'large' ? 'aspect-[3/4]' : variant === 'small' ? 'aspect-square' : 'aspect-[3/4]'

  function handleAdd() {
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
    <div className="group">
      <Link href={`/products/${item.id}`} className="block">
        <div className={`relative ${aspectClass} bg-stone-100 overflow-hidden`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-xs tracking-widest uppercase">
              No image
            </div>
          )}
          {!item.in_stock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Badge variant="outline" className="text-xs tracking-widest">
                Sold Out
              </Badge>
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-sm tracking-wide text-stone-800">{item.name}</p>
          <p className="text-xs text-stone-500">{formatPrice(item.price_minor)}</p>
        </div>
      </Link>
      <button
        onClick={handleAdd}
        disabled={!item.in_stock}
        className="mt-2 w-full py-2 text-xs tracking-widest uppercase border border-stone-200 text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        {item.in_stock ? 'Add to Cart' : 'Sold Out'}
      </button>
    </div>
  )
}
