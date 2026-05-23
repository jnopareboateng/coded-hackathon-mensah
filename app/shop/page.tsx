'use client'

import { useItems } from '@/lib/queries'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/ui/skeleton'

export default function ShopPage() {
  const { data: items = [], isLoading, isError } = useItems()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-2">Mensah Atelier</p>
        <h1 className="font-serif text-4xl">The Collection</h1>
        {!isLoading && (
          <p className="text-sm text-stone-400 mt-2">{items.length} pieces</p>
        )}
      </div>

      {isError && (
        <p className="text-sm text-red-500 py-8 text-center">
          Unable to load products. Please refresh.
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      ) : (
        <ProductGrid items={items} />
      )}
    </div>
  )
}
