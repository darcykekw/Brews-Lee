'use client'

import { useState } from 'react'
import Image from 'next/image'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'
import type { MenuItem, ItemCustomization } from '@/types/index'

interface Props {
  item: MenuItem & { item_customizations?: ItemCustomization }
  open: boolean
  onClose: () => void
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-espresso-800 dark:text-cream-200">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
              value === opt
                ? 'bg-espresso-900 dark:bg-cream-100 text-white dark:text-espresso-900 border-transparent'
                : 'border-stone-200 dark:border-espresso-600 text-stone-600 dark:text-stone-300 hover:border-caramel-400'
            }`}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CustomizationModal({ item, open, onClose }: Props) {
  const customizations = item.item_customizations
  const sizes = customizations?.sizes ?? ['small', 'medium', 'large']
  const sugars = customizations?.sugar_levels ?? ['less sweet', 'normal', 'extra sweet']
  const temps = customizations?.temperatures ?? ['hot', 'iced']

  const [size, setSize] = useState(sizes[1] ?? sizes[0])
  const [sugar, setSugar] = useState(sugars[1] ?? sugars[0])
  const [temp, setTemp] = useState(temps[0])
  const [qty, setQty] = useState(1)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  function handleAdd() {
    addItem(
      {
        menuItemId: item.id,
        name: item.name,
        price: Number(item.price),
        image_url: item.image_url,
        customization: { size, sugar_level: sugar, temperature: temp },
      },
      qty
    )
    onClose()
    openCart()
  }

  return (
    <Modal open={open} onClose={onClose} title={item.name} size="md">
      <div className="space-y-5">
        {/* Item image */}
        {item.image_url && (
          <div className="relative h-40 rounded-xl overflow-hidden bg-cream-100 dark:bg-espresso-700">
            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
          </div>
        )}

        {item.description && (
          <p className="text-sm text-stone-500 dark:text-stone-400">{item.description}</p>
        )}

        <p className="font-semibold text-espresso-900 dark:text-cream-100">
          ₱{Number(item.price).toFixed(2)}
        </p>

        {sizes.length > 1 && (
          <OptionGroup label="Size" options={sizes} value={size} onChange={setSize} />
        )}
        {sugars.length > 1 && (
          <OptionGroup label="Sugar Level" options={sugars} value={sugar} onChange={setSugar} />
        )}
        {temps.length > 1 && (
          <OptionGroup label="Temperature" options={temps} value={temp} onChange={setTemp} />
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-espresso-800 dark:text-cream-200">Quantity</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg border border-stone-200 dark:border-espresso-600 flex items-center justify-center text-espresso-700 dark:text-cream-200 hover:bg-cream-100 dark:hover:bg-espresso-700 transition-colors"
            >
              -
            </button>
            <span className="w-6 text-center font-medium text-espresso-900 dark:text-cream-100">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-lg border border-stone-200 dark:border-espresso-600 flex items-center justify-center text-espresso-700 dark:text-cream-200 hover:bg-cream-100 dark:hover:bg-espresso-700 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <Button onClick={handleAdd} className="w-full" size="lg">
          Add to Cart — ₱{(Number(item.price) * qty).toFixed(2)}
        </Button>
      </div>
    </Modal>
  )
}
