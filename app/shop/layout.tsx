import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Collection — Mensah Atelier',
  description: 'Browse Mensah Atelier\'s full catalogue of bespoke tailored menswear, suits, and occasion wear.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
