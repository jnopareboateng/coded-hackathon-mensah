import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '@/lib/store'

const item1 = { item_id: 'outfit-1', name: 'Outfit 1', price_minor: 80000, image_url: '', qty: 1 }
const item2 = { item_id: 'outfit-2', name: 'Outfit 2', price_minor: 200000, image_url: '', qty: 1 }

beforeEach(() => {
  useCartStore.getState().clear()
})

describe('add', () => {
  it('adds a new item', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.add(item1))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].item_id).toBe('outfit-1')
  })
  it('merges qty when same item added twice', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => {
      result.current.add(item1)
      result.current.add({ ...item1, qty: 2 })
    })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].qty).toBe(3)
  })
})

describe('remove', () => {
  it('removes an item by id', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => {
      result.current.add(item1)
      result.current.add(item2)
    })
    act(() => result.current.remove('outfit-1'))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].item_id).toBe('outfit-2')
  })
})

describe('updateQty', () => {
  it('updates quantity', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.add(item1))
    act(() => result.current.updateQty('outfit-1', 5))
    expect(result.current.items[0].qty).toBe(5)
  })
  it('removes item when qty set to 0', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.add(item1))
    act(() => result.current.updateQty('outfit-1', 0))
    expect(result.current.items).toHaveLength(0)
  })
})

describe('totalItems / totalMinor', () => {
  it('sums item quantities', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => {
      result.current.add(item1)
      result.current.add({ ...item2, qty: 2 })
    })
    expect(result.current.totalItems()).toBe(3)
  })
  it('sums price × qty', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => {
      result.current.add(item1)
      result.current.add({ ...item2, qty: 2 })
    })
    expect(result.current.totalMinor()).toBe(80000 + 200000 * 2)
  })
})
