'use client'

import { useState, useTransition } from 'react'
import { MapPin, Pencil, Trash2, Star, Plus } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/app/actions/addresses'
import type { Address } from '@/types/index'

const field = {
  backgroundColor: 'var(--color-base)',
  border: '1.5px solid var(--color-muted)',
  color: 'var(--color-text)',
}

function AddressDialog({
  trigger, initial, onSave,
}: {
  trigger: React.ReactNode
  initial?: Address
  onSave: (label: string, full_address: string, is_default: boolean) => Promise<void>
}) {
  const [open, setOpen]               = useState(false)
  const [label, setLabel]             = useState(initial?.label ?? '')
  const [fullAddress, setFullAddress] = useState(initial?.full_address ?? '')
  const [isDefault, setIsDefault]     = useState(initial?.is_default ?? false)
  const [isPending, start]            = useTransition()
  const [error, setError]             = useState<string | null>(null)

  function handleSave() {
    setError(null)
    start(async () => {
      try {
        await onSave(label || 'Home', fullAddress, isDefault)
        setOpen(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save address.')
      }
    })
  }

  function handleOpenChange(v: boolean) {
    if (v) { setLabel(initial?.label ?? ''); setFullAddress(initial?.full_address ?? ''); setIsDefault(initial?.is_default ?? false) }
    setOpen(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="mx-4 max-w-sm"
        style={{ backgroundColor: 'var(--color-subtle)', border: '1px solid var(--color-muted)' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--color-text)' }}>
            {initial ? 'Edit Address' : 'Add Address'}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="addr-label" style={{ color: 'var(--color-text)' }}>Label</Label>
            <input
              id="addr-label"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Home, Work, School"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={field}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onBlur={e =>  (e.currentTarget.style.borderColor = 'var(--color-muted)')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-full" style={{ color: 'var(--color-text)' }}>Full Address</Label>
            <textarea
              id="addr-full"
              value={fullAddress}
              onChange={e => setFullAddress(e.target.value)}
              placeholder="House no., Street, Barangay, City, Province"
              rows={3}
              required
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none"
              style={field}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
              onBlur={e =>  (e.currentTarget.style.borderColor = 'var(--color-muted)')}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDefault(v => !v)}
              className="relative w-10 h-6 rounded-full transition-colors shrink-0"
              style={{ backgroundColor: isDefault ? 'var(--color-accent)' : 'var(--color-muted)' }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                style={{ transform: isDefault ? 'translateX(20px)' : 'translateX(4px)' }}
              />
            </button>
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>Set as default address</span>
          </div>
        </div>

        {error && (
          <p className="px-6 pb-2 text-xs text-red-500">{error}</p>
        )}

        <DialogFooter style={{ borderColor: 'var(--color-muted)' }}>
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2 text-sm rounded-full transition-colors"
            style={{ border: '1.5px solid var(--color-muted)', color: 'var(--color-text-muted)', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || !fullAddress.trim()}
            className="px-5 py-2 text-sm font-semibold rounded-full hover:opacity-85 disabled:opacity-50 flex items-center gap-2 transition-opacity"
            style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-base)' }}
          >
            {isPending && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddressCard({ address }: { address: Address }) {
  const [isPending, start] = useTransition()
  const handle = (fn: () => Promise<void>) => start(async () => { try { await fn() } catch { } })

  return (
    <div
      className="rounded-2xl p-4 space-y-2"
      style={{ backgroundColor: 'var(--color-base)', border: '1px solid var(--color-muted)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{address.label}</span>
          {address.is_default && (
            <span
              className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-base)' }}
            >
              Default
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Edit */}
          <AddressDialog
            trigger={
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                title="Edit"
              >
                <Pencil size={13} strokeWidth={2} />
              </button>
            }
            initial={address}
            onSave={(l, a, d) => updateAddress(address.id, l, a, d)}
          />

          {/* Set default */}
          {!address.is_default && (
            <button
              onClick={() => handle(() => setDefaultAddress(address.id))}
              disabled={isPending}
              title="Set as default"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--color-accent)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Star size={13} strokeWidth={2} />
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => handle(() => deleteAddress(address.id))}
            disabled={isPending}
            title="Delete"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-muted)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <MapPin size={13} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
        <p className="text-sm leading-snug" style={{ color: 'var(--color-text-muted)' }}>{address.full_address}</p>
      </div>
    </div>
  )
}

export default function AddressSection({ addresses }: { addresses: Address[] }) {
  return (
    <div
      className="rounded-2xl p-6 space-y-4"
      style={{ backgroundColor: 'var(--color-subtle)', border: '1px solid var(--color-muted)' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          Saved Addresses
        </h2>
        <AddressDialog
          trigger={
            <button
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full hover:opacity-85 transition-opacity"
              style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-base)' }}
            >
              <Plus size={13} strokeWidth={2.5} /> Add New
            </button>
          }
          onSave={(l, a, d) => addAddress(l, a, d)}
        />
      </div>

      {addresses.length === 0 ? (
        <p className="text-sm py-4 text-center" style={{ color: 'var(--color-text-muted)' }}>
          No saved addresses yet. Add one to speed up checkout.
        </p>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => <AddressCard key={addr.id} address={addr} />)}
        </div>
      )}
    </div>
  )
}
