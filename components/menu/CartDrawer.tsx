'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useCheckoutStore } from '@/store/checkout'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const openCheckout = useCheckoutStore((s) => s.open)

  if (!isOpen) return null

  const subtotal = getSubtotal()

  function handleCheckout() {
    closeCart()
    openCheckout()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeCart} />
      <div className="relative w-full max-w-sm bg-[var(--color-base)] dark:bg-espresso-900 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-muted)] dark:border-espresso-700">
          <h2 className="font-semibold text-espresso-900 dark:text-cream-100">Your Cart</h2>
          <button onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-muted)] dark:hover:bg-espresso-700 text-stone-400 transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-16">
              <p className="text-stone-400 text-sm">Your cart is empty</p>
              <button onClick={closeCart} className="text-sm text-[var(--color-accent)] hover:underline">
                Browse menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-3">
                <div className="w-16 h-16 rounded-xl bg-[var(--color-subtle)] dark:bg-espresso-700 overflow-hidden shrink-0 relative">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-espresso-900 dark:text-cream-100 truncate">{item.name}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                    {[item.customization.size, item.customization.temperature, item.customization.sugar_level]
                      .filter(Boolean).join(' · ')}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 rounded-md border border-[var(--color-muted)] dark:border-espresso-600 flex items-center justify-center text-xs hover:bg-[var(--color-subtle)]"
                      >-</button>
                      <span className="text-sm w-4 text-center text-espresso-900 dark:text-cream-100">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 rounded-md border border-[var(--color-muted)] dark:border-espresso-600 flex items-center justify-center text-xs hover:bg-[var(--color-subtle)]"
                      >+</button>
                    </div>
                    <p className="text-sm font-medium text-espresso-900 dark:text-cream-100">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button onClick={() => removeItem(item.cartItemId)}
                  className="text-stone-300 dark:text-stone-600 hover:text-red-400 transition-colors self-start mt-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-muted)] dark:border-espresso-700 p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500 dark:text-stone-400">Subtotal</span>
              <span className="font-semibold text-espresso-900 dark:text-cream-100">₱{subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-espresso-900 dark:bg-cream-100 text-cream-50 dark:text-espresso-900 font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
