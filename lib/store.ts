import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  item_id: string
  name: string
  price_minor: number
  image_url: string
  qty: number
  item_note?: string | null
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  add: (item: CartItem) => void
  remove: (item_id: string) => void
  updateQty: (item_id: string, qty: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalMinor: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.item_id === item.item_id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.item_id === item.item_id ? { ...i, qty: i.qty + item.qty } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      remove: (item_id) =>
        set((state) => ({ items: state.items.filter((i) => i.item_id !== item_id) })),
      updateQty: (item_id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.item_id !== item_id)
              : state.items.map((i) => (i.item_id === item_id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalMinor: () => get().items.reduce((sum, i) => sum + i.price_minor * i.qty, 0),
    }),
    {
      name: 'mensah-cart',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? sessionStorage
          : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as Storage)
      ),
    }
  )
)
