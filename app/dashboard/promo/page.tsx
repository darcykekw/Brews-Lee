'use client'

import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function PromoBannerPage() {
  const [message, setMessage] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/promo')
      .then((r) => r.json())
      .then((d) => {
        setMessage(d.message ?? '')
        setIsActive(d.is_active ?? false)
        setLoading(false)
      })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/promo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, is_active: isActive }),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error ?? 'Failed to save. Please try again.')
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <div className="text-sm text-stone-400 py-8">Loading...</div>

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="font-serif text-2xl font-semibold text-espresso-900 dark:text-cream-100">Promo Banner</h1>

      <div className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 space-y-5">
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Banner Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your announcement..."
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-caramel-500' : 'bg-stone-200 dark:bg-espresso-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-espresso-900 dark:text-cream-100">
              {isActive ? 'Banner is visible' : 'Banner is hidden'}
            </span>
          </div>

          {isActive && message && (
            <div className="bg-caramel-500 text-white text-center text-sm py-2 px-4 rounded-xl">
              Preview: {message}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" loading={saving}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  )
}
