import { ProductCard } from './ProductCard'
import type { Item } from '@/types/api'

interface Props {
  items: Item[]
}

export function ProductGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  )
}
