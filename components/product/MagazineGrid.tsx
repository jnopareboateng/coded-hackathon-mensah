import { ProductCard } from './ProductCard'
import type { Item } from '@/types/api'

interface Props {
  items: Item[]
}

export function MagazineGrid({ items }: Props) {
  if (items.length === 0) return null
  const [featured, second, third, ...rest] = items

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {featured && <ProductCard item={featured} variant="large" />}
        </div>
        <div className="flex flex-col gap-4">
          {second && <ProductCard item={second} variant="small" />}
          {third && <ProductCard item={third} variant="small" />}
        </div>
      </div>

      {rest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rest.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
