import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/product/ProductCard'
import type { Item } from '@/types/api'

jest.mock('@/lib/store', () => ({
  useCartStore: () => ({ add: jest.fn(), openCart: jest.fn() }),
}))

const item: Item = {
  id: 'item-1',
  merchant_id: 'mensah',
  name: 'The Accra Suit',
  description: 'A fine suit',
  price_minor: 120000,
  currency: 'GHS',
  image_urls: null,
  in_stock: true,
}

describe('ProductCard', () => {
  it('renders item name', () => {
    render(<ProductCard item={item} />)
    expect(screen.getByText('The Accra Suit')).toBeInTheDocument()
  })

  it('renders formatted price', () => {
    render(<ProductCard item={item} />)
    expect(screen.getByText(/1,200\.00/)).toBeInTheDocument()
  })

  it('shows Add to Cart when in stock', () => {
    render(<ProductCard item={item} />)
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeEnabled()
  })

  it('shows Sold Out and disables button when out of stock', () => {
    render(<ProductCard item={{ ...item, in_stock: false }} />)
    expect(screen.getByRole('button', { name: /sold out/i })).toBeDisabled()
  })

  it('links to correct product page', () => {
    render(<ProductCard item={item} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/item-1')
  })
})
