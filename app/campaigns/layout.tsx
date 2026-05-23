import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campaigns — Mensah Atelier',
  description: 'Explore curated campaigns and featured collections from Mensah Atelier.',
}

export default function CampaignsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
