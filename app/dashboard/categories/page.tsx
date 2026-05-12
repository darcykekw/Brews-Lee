'use client'

import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Category } from '@/types/index'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories').then((r) => r.json()).then((d) => setCategories(d.categories ?? []))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), sort_order: categories.length + 1 }),
    })
    const data = await res.json()
    if (data.category) { setCategories((prev) => [...prev, data.category]); setName(''); setSlug('') }
    setSaving(false)
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? Menu items in it cannot be deleted if orders exist.')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-2xl font-semibold text-espresso-900 dark:text-cream-100">Categories</h1>

      <div className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 space-y-4">
        <h2 className="font-medium text-espresso-900 dark:text-cream-100">Add Category</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Slug (auto)" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={name.toLowerCase().replace(/\s+/g, '-')} />
          </div>
          <Button type="submit" loading={saving}>Add Category</Button>
        </form>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between bg-white dark:bg-espresso-800 rounded-xl border border-stone-100 dark:border-espresso-700 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-espresso-900 dark:text-cream-100">{cat.name}</p>
              <p className="text-xs text-stone-400">{cat.slug}</p>
            </div>
            <button onClick={() => deleteCategory(cat.id)} className="text-xs text-stone-400 hover:text-red-400 transition-colors">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
