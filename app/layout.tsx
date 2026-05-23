import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Toaster } from 'sonner'

const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
})
const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Mensah Atelier — Tailored Menswear',
  description:
    'Luxury tailored menswear from Mensah Atelier. Shop bespoke suits, shirts, and occasion wear.',
  openGraph: {
    title: 'Mensah Atelier — Tailored Menswear',
    description: 'Precision-cut menswear for the man who understands that detail is everything.',
    url: 'https://coded-hackathon-mensah-9bre.vercel.app',
    siteName: 'Mensah Atelier',
    locale: 'en_GH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mensah Atelier — Tailored Menswear',
    description: 'Precision-cut menswear for the man who understands that detail is everything.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-[#fafaf8] text-stone-900 antialiased">
        <Providers>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
