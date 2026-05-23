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
    variant === 'large' ? 'aspect-[3/4]' : variant === 'small' ? 'aspect-[3/4]' : 'aspect-[3/4]'

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
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
        {/* Image with hover overlay CTA */}
        <div className={`relative ${aspectClass} bg-stone-100 overflow-hidden`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] tracking-[0.35em] uppercase text-stone-300">
                No image
              </span>
            </div>
          )}

          {/* Hover overlay with CTA */}
          {item.in_stock && (
            <div
              className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
              onClick={handleAdd}
            >
              <div className="bg-stone-900/90 backdrop-blur-sm py-3 px-4 text-center cursor-pointer hover:bg-stone-900 transition-colors">
                <span className="text-white text-[10px] tracking-[0.3em] uppercase">
                  + Add to Cart
                </span>
              </div>
            </div>
          )}

          {!item.in_stock && (
            <div className="absolute inset-0 bg-white/55 flex items-center justify-center">
              <Badge variant="outline" className="text-[10px] tracking-widest">
                Sold Out
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 flex items-start justify-between gap-2">
          <p className="text-sm tracking-wide text-stone-800 leading-snug flex-1">{item.name}</p>
          <p className="text-xs text-stone-500 shrink-0 pt-0.5">{formatPrice(item.price_minor)}</p>
        </div>
      </Link>

      {/* Visible button on mobile (hover doesn't work) */}
      <button
        onClick={(e) => { e.preventDefault(); handleAdd(e) }}
        disabled={!item.in_stock}
        className="mt-2 w-full py-2 text-[10px] tracking-[0.28em] uppercase border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer md:hidden"
      >
        {item.in_stock ? 'Add to Cart' : 'Sold Out'}
      </button>
    </div>
  )
}
