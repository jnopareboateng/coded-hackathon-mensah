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

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  // Accept 10-digit local (024...) or 12-digit international (233...)
  if (digits.length === 10) return `+${digits.startsWith('0') ? '233' + digits.slice(1) : digits}`
  if (digits.length === 12 && digits.startsWith('233')) return `+${digits}`
  return raw
}

function isPhoneValid(phone: string): boolean {
  if (!phone.trim()) return true // optional
  const digits = phone.replace(/\D/g, '')
  return (
    (digits.length === 10) ||
    (digits.length === 12 && digits.startsWith('233')) ||
    (digits.length === 13 && digits.startsWith('233'))
  )
}

export function CheckoutForm({ onSubmit, isLoading }: Props) {
  const [values, setValues] = useState<CheckoutFormValues>({
    customer_name: '',
    customer_phone: '',
    customer_note: '',
  })
  const [phoneError, setPhoneError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function set(k: keyof CheckoutFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setValues((v) => ({ ...v, [k]: val }))
      if (k === 'customer_phone') {
        setPhoneError(isPhoneValid(val) ? '' : 'Enter a valid Ghana number (e.g. 0241234567)')
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!isPhoneValid(values.customer_phone)) {
      setPhoneError('Enter a valid Ghana number (e.g. 0241234567)')
      return
    }
    const normalised = {
      ...values,
      customer_phone: values.customer_phone
        ? normalisePhone(values.customer_phone)
        : '',
    }
    onSubmit(normalised)
  }

  const phoneInvalid = submitted && !!phoneError

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="name" className="text-[10px] tracking-[0.35em] uppercase text-stone-400">
          Name <span className="text-stone-300 normal-case tracking-normal">(optional)</span>
        </Label>
        <Input
          id="name"
          placeholder="Your name"
          value={values.customer_name}
          onChange={set('customer_name')}
          autoComplete="name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-[10px] tracking-[0.35em] uppercase text-stone-400">
          Phone <span className="text-stone-300 normal-case tracking-normal">(optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0241234567"
          value={values.customer_phone}
          onChange={set('customer_phone')}
          autoComplete="tel"
          inputMode="tel"
          className={`mt-1 ${phoneInvalid ? 'border-red-300 focus:border-red-500' : ''}`}
        />
        {phoneInvalid && (
          <p className="text-[11px] text-red-400 mt-1">{phoneError}</p>
        )}
      </div>

      <div>
        <Label htmlFor="note" className="text-[10px] tracking-[0.35em] uppercase text-stone-400">
          Order Note <span className="text-stone-300 normal-case tracking-normal">(optional)</span>
        </Label>
        <Input
          id="note"
          placeholder="Delivery address, deadline, special requests…"
          value={values.customer_note}
          onChange={set('customer_note')}
          className="mt-1"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
            Creating order…
          </>
        ) : (
          'Order via WhatsApp'
        )}
      </button>

      <p className="text-[11px] text-stone-400 text-center leading-relaxed">
        We&apos;ll open WhatsApp with your order pre-filled.
        <br />No payment required here.
      </p>
    </form>
  )
}
