'use client'

import { useState } from 'react'
import Image from 'next/image'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { MenuItem, Category } from '@/types/index'

interface Props {
  initialItems: (MenuItem & { category?: { name: string } })[]
  categories: Category[]
}

const emptyForm = { name: '', description: '', price: '', category_id: '', image_url: '' }

export default function DashboardMenuClient({ initialItems, categories }: Props) {
  const [items, setItems] = useState(initialItems)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  function startEdit(item: MenuItem) {
    setEditId(item.id)
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category_id: item.category_id,
      image_url: item.image_url ?? '',
    })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setForm((f) => ({ ...f, image_url: data.url }))
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = { ...form, price: parseFloat(form.price) }
    const url = editId ? `/api/admin/menu/${editId}` : '/api/admin/menu'
    const method = editId ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (data.item) {
      if (editId) {
        setItems((prev) => prev.map((i) => i.id === editId ? data.item : i))
      } else {
        setItems((prev) => [...prev, data.item])
      }
    }

    setForm(emptyForm)
    setEditId(null)
    setSaving(false)
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this item?')) return
    await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  async function toggleSoldOut(item: MenuItem) {
    const res = await fetch(`/api/admin/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_sold_out: !item.is_sold_out }),
    })
    const data = await res.json()
    if (data.item) setItems((prev) => prev.map((i) => i.id === item.id ? data.item : i))
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 space-y-4">
        <h2 className="font-medium text-espresso-900 dark:text-cream-100">
          {editId ? 'Edit Item' : 'Add Item'}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Price (₱)" type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
          </div>
          <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-espresso-800 dark:text-cream-200">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-espresso-800 border border-stone-200 dark:border-espresso-700 text-espresso-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-caramel-400"
            >
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-espresso-800 dark:text-cream-200">Photo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-stone-500 file:mr-3 file:text-xs file:font-medium file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-cream-100 dark:file:bg-espresso-700 file:text-espresso-900 dark:file:text-cream-100 hover:file:bg-cream-200" />
            {uploading && <p className="text-xs text-stone-400">Uploading...</p>}
            {form.image_url && <div className="relative w-24 h-24 rounded-xl overflow-hidden"><Image src={form.image_url} alt="Preview" fill className="object-cover" /></div>}
          </div>
          <div className="flex gap-3">
            <Button type="submit" loading={saving}>{editId ? 'Save Changes' : 'Add Item'}</Button>
            {editId && <Button type="button" variant="ghost" onClick={() => { setEditId(null); setForm(emptyForm) }}>Cancel</Button>}
          </div>
        </form>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-4">
            <div className="w-14 h-14 rounded-xl bg-cream-100 dark:bg-espresso-700 overflow-hidden shrink-0 relative">
              {item.image_url
                ? <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-stone-300"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" /></svg></div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-espresso-900 dark:text-cream-100 truncate">{item.name}</p>
              <p className="text-xs text-stone-400">{(item.category as { name: string } | undefined)?.name} · ₱{Number(item.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleSoldOut(item)}
                className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                  item.is_sold_out
                    ? 'border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                {item.is_sold_out ? 'Sold Out' : 'Available'}
              </button>
              <button onClick={() => startEdit(item)} className="text-xs text-caramel-500 hover:underline">Edit</button>
              <button onClick={() => deleteItem(item.id)} className="text-xs text-stone-400 hover:text-red-400 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
