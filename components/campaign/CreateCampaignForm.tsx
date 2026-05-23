'use client'

import { useState } from 'react'
import { useCreateCampaign, useItems } from '@/lib/queries'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const MERCHANT = process.env.NEXT_PUBLIC_MERCHANT_SLUG ?? 'mensah'
const TEAM_SLUG = process.env.NEXT_PUBLIC_TEAM_SLUG ?? 'mensah'

export function CreateCampaignForm() {
  const [title, setTitle] = useState('')
  const [copyText, setCopyText] = useState('')
  const [featured, setFeatured] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useCreateCampaign()
  const { data: items = [] } = useItems()
  const { toast } = useToast()

  function toggleItem(id: string) {
    setFeatured((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    mutate(
      {
        merchant_id: MERCHANT,
        team_slug: TEAM_SLUG,
        title: title.trim(),
        copy_text: copyText || null,
        featured_item_ids: featured.length ? featured : null,
      },
      {
        onSuccess: () => {
          toast({ title: 'Campaign created' })
          setTitle('')
          setCopyText('')
          setFeatured([])
          setOpen(false)
        },
        onError: (err) =>
          toast({ title: 'Failed', description: (err as Error).message, variant: 'destructive' }),
      }
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs tracking-widest uppercase border border-stone-200 px-4 py-2 hover:bg-stone-900 hover:text-white transition-all cursor-pointer"
      >
        + New Campaign
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-stone-200 p-6 space-y-4 bg-white">
      <h3 className="font-serif text-lg">Create Campaign</h3>
      <div>
        <Label className="text-xs tracking-widest uppercase text-stone-500">Title *</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Campaign title"
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label className="text-xs tracking-widest uppercase text-stone-500">Copy</Label>
        <Input
          value={copyText}
          onChange={(e) => setCopyText(e.target.value)}
          placeholder="Short promotional text"
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-xs tracking-widest uppercase text-stone-500 block mb-2">
          Featured Items
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={featured.includes(item.id)}
                onChange={() => toggleItem(item.id)}
                className="accent-stone-900"
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-stone-900 text-white text-xs tracking-widest uppercase disabled:opacity-50 cursor-pointer"
        >
          {isPending ? 'Creating…' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-6 py-2 border border-stone-200 text-xs tracking-widest uppercase cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
