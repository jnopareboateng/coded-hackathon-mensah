import Link from 'next/link'
import type { CampaignSummary } from '@/types/api'

interface Props {
  campaigns: CampaignSummary[]
}

export function CampaignStrip({ campaigns }: Props) {
  if (campaigns.length === 0) return null
  const latest = campaigns[0]

  return (
    <div className="bg-stone-900 text-stone-200 py-2.5 px-6 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <span className="hidden sm:block text-[9px] tracking-[0.5em] text-stone-500 uppercase shrink-0">
            Campaign
          </span>
          <div className="w-px h-3 bg-stone-700 hidden sm:block shrink-0" />
          <p className="text-[11px] tracking-[0.25em] uppercase truncate">
            {latest.title}
            {latest.copy_text && (
              <span className="ml-3 text-stone-500 normal-case tracking-normal font-light">
                — {latest.copy_text}
              </span>
            )}
          </p>
        </div>
        <Link
          href={`/campaigns/${latest.id}`}
          className="text-[10px] tracking-[0.35em] uppercase text-stone-500 hover:text-stone-200 transition-colors shrink-0 flex items-center gap-1.5"
        >
          View
          <span className="text-sm leading-none">→</span>
        </Link>
      </div>
    </div>
  )
}
