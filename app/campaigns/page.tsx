'use client'

import { useCampaigns } from '@/lib/queries'
import { CampaignCard } from '@/components/campaign/CampaignCard'
import { CreateCampaignForm } from '@/components/campaign/CreateCampaignForm'
import { Skeleton } from '@/components/ui/skeleton'

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading } = useCampaigns()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-baseline justify-between mb-12">
        <div>
          <p className="text-xs tracking-[0.4em] text-stone-400 uppercase mb-2">Mensah Atelier</p>
          <h1 className="font-serif text-4xl">Campaigns</h1>
        </div>
        <CreateCampaignForm />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone-200">
          <p className="text-sm text-stone-400 tracking-wide mb-4">No campaigns yet</p>
          <p className="text-xs text-stone-300">
            Create the first campaign above to feature your collection
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  )
}
