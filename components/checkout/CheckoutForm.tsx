'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface CheckoutFormValues {
  customer_name: string
  customer_phone: string
  customer_note: string
}

interface Props {
  onSubmit: (values: CheckoutFormValues) => void
  isLoading: boolean
}

export function CheckoutForm({ onSubmit, isLoading }: Props) {
  const [values, setValues] = useState<CheckoutFormValues>({
    customer_name: '',
    customer_phone: '',
    customer_note: '',
  })

  const set =
    (k: keyof CheckoutFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(values) }} className="space-y-3">
      <div>
        <Label htmlFor="name" className="text-xs tracking-widest uppercase text-stone-500">
          Name
        </Label>
        <Input
          id="name"
          placeholder="Your name"
          value={values.customer_name}
          onChange={set('customer_name')}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="phone" className="text-xs tracking-widest uppercase text-stone-500">
          Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+233..."
          value={values.customer_phone}
          onChange={set('customer_phone')}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="note" className="text-xs tracking-widest uppercase text-stone-500">
          Note
        </Label>
        <Input
          id="note"
          placeholder="Size, special requests…"
          value={values.customer_note}
          onChange={set('customer_note')}
          className="mt-1"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {isLoading ? 'Creating order…' : 'Order via WhatsApp'}
      </button>
    </form>
  )
}
