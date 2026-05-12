'use client'

import { useState } from 'react'
import Image from 'next/image'
import CustomizationModal from './CustomizationModal'
import type { MenuItem, ItemCustomization } from '@/types/index'

interface Props {
  item: MenuItem & { item_customizations?: ItemCustomization }
}

export default function MenuCard({ item }: Props) {
  const [open, setOpen] = useState(false)
  const soldOut = item.is_sold_out || !item.is_available

  return (
    <>
      <div
        onClick={() => !soldOut && setOpen(true)}
        className={`group bg-white dark:bg-espresso-800 rounded-2xl overflow-hidden border border-stone-100 dark:border-espresso-700 transition-all duration-300 ${
          soldOut ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md dark:hover:shadow-espresso-700/40 hover:-translate-y-0.5'
        }`}
      >
        {/* Image */}
        <div className="relative h-44 bg-cream-100 dark:bg-espresso-700 overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className={`object-cover transition-transform duration-500 ${!soldOut ? 'group-hover:scale-105' : ''}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-stone-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {soldOut && (
            <div className="absolute inset-0 bg-white/60 dark:bg-espresso-900/60 flex items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 bg-white dark:bg-espresso-800 px-3 py-1 rounded-full border border-stone-200 dark:border-espresso-600">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-1.5">
          <h3 className="font-medium text-espresso-900 dark:text-cream-100 leading-snug">{item.name}</h3>
          {item.description && (
            <p className="text-xs text-stone-400 dark:text-stone-500 line-clamp-2 leading-relaxed">{item.description}</p>
          )}
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm font-semibold text-espresso-900 dark:text-cream-100">
              ₱{Number(item.price).toFixed(2)}
            </p>
            {!soldOut && (
              <span className="text-xs text-caramel-500 font-medium group-hover:underline">Add +</span>
            )}
          </div>
        </div>
      </div>

      {open && (
        <CustomizationModal item={item} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
