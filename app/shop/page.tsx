'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useItems } from '@/lib/queries'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/ui/skeleton'

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc'

export default function ShopPage() {
  const { data: items = [], isLoading, isError } = useItems()
  const [query, setQuery] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<SortOption>('default')

  const filtered = useMemo(() => {
    let list = [...items]

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((i) => i.name.toLowerCase().includes(q))
    }

    if (inStockOnly) {
      list = list.filter((i) => i.in_stock)
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price_minor - b.price_minor)
    else if (sort === 'price-desc') list.sort((a, b) => b.price_minor - a.price_minor)
    else if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [items, query, inStockOnly, sort])

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-2">Mensah Atelier</p>
        <h1 className="font-serif text-4xl">The Collection</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="search"
            placeholder="Search pieces…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 bg-white focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-400"
          />
        </div>

        <label className="flex items-center gap-2 text-xs tracking-widest uppercase text-stone-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-stone-900 w-4 h-4"
          />
          In Stock Only
        </label>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-xs tracking-widest uppercase border border-stone-200 bg-white px-3 py-2.5 focus:outline-none focus:border-stone-900 transition-colors cursor-pointer text-stone-500"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
        </select>
      </div>

      {/* Result count */}
      {!isLoading && (
        <p className="text-xs text-stone-400 tracking-wider mb-6">
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
          {(query || inStockOnly) && ' found'}
        </p>
      )}

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
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-stone-200">
          <p className="text-sm text-stone-400 tracking-wide">No pieces match your search</p>
          <button
            onClick={() => { setQuery(''); setInStockOnly(false); setSort('default') }}
            className="mt-4 text-xs tracking-widest uppercase underline text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ProductGrid items={filtered} />
      )}
    </div>
  )
}
