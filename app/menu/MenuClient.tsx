'use client'

import { useState, useMemo } from 'react'
import MenuCard from '@/components/menu/MenuCard'
import type { Category, MenuItem, ItemCustomization } from '@/types/index'

interface Props {
  categories: Category[]
  items: (MenuItem & { item_customizations?: ItemCustomization })[]
}

export default function MenuClient({ categories, items }: Props) {
  const [search, setSearch] = useState('')
  const [activeSlug, setActiveSlug] = useState<string>('all')

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeSlug === 'all' ||
        (item.category as { slug: string } | undefined)?.slug === activeSlug
      return matchesSearch && matchesCategory
    })
  }, [items, search, activeSlug])

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-espresso-700 bg-white dark:bg-espresso-800 text-sm text-espresso-900 dark:text-cream-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-caramel-400 focus:border-transparent"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[{ id: 'all', name: 'All', slug: 'all' }, ...categories].map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveSlug(cat.slug)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeSlug === cat.slug
                ? 'bg-espresso-900 dark:bg-cream-100 text-white dark:text-espresso-900'
                : 'bg-white dark:bg-espresso-800 border border-stone-200 dark:border-espresso-700 text-stone-600 dark:text-stone-300 hover:border-caramel-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-2">
          <p className="text-stone-400 dark:text-stone-500">No items found.</p>
          {search && (
            <button onClick={() => setSearch('')} className="text-sm text-caramel-500 hover:underline">
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  )
}
