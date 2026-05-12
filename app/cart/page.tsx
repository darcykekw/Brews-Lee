'use client'

import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/store/cart'
import { useCheckoutStore } from '@/store/checkout'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore()
  const openCheckout = useCheckoutStore((s) => s.open)
  const subtotal = getSubtotal()

  return (
    <>      <main className="min-h-screen bg-cream-50 dark:bg-espresso-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="font-serif text-3xl font-semibold text-espresso-900 dark:text-cream-100 mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <p className="text-stone-400 dark:text-stone-500">Your cart is empty.</p>
              <Link href="/menu" className="text-sm text-caramel-500 hover:underline">
                Browse the menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 bg-white dark:bg-espresso-800 rounded-2xl p-4 border border-stone-100 dark:border-espresso-700">
                    <div className="w-20 h-20 rounded-xl bg-cream-100 dark:bg-espresso-700 overflow-hidden shrink-0 relative">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-espresso-900 dark:text-cream-100">{item.name}</p>
                        <button onClick={() => removeItem(item.cartItemId)} className="text-stone-300 hover:text-red-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        {[item.customization.size, item.customization.temperature, item.customization.sugar_level].filter(Boolean).join(' · ')}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="w-7 h-7 rounded-lg border border-stone-200 dark:border-espresso-600 text-sm flex items-center justify-center hover:bg-cream-100 dark:hover:bg-espresso-700">-</button>
                          <span className="w-5 text-center text-sm font-medium text-espresso-900 dark:text-cream-100">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-7 h-7 rounded-lg border border-stone-200 dark:border-espresso-600 text-sm flex items-center justify-center hover:bg-cream-100 dark:hover:bg-espresso-700">+</button>
                        </div>
                        <p className="font-semibold text-espresso-900 dark:text-cream-100">₱{(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={clearCart} className="text-sm text-stone-400 hover:text-red-400 transition-colors">
                  Clear cart
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 space-y-4 sticky top-24">
                  <h2 className="font-semibold text-espresso-900 dark:text-cream-100">Order Summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-stone-500 dark:text-stone-400">
                      <span>Subtotal</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 dark:text-stone-400">
                      <span>Payment</span>
                      <span>Cash on pickup</span>
                    </div>
                    <div className="border-t border-stone-100 dark:border-espresso-700 pt-2 flex justify-between font-semibold text-espresso-900 dark:text-cream-100">
                      <span>Total</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={openCheckout}
                    className="w-full text-center px-4 py-3 bg-espresso-900 dark:bg-cream-100 text-cream-50 dark:text-espresso-900 font-medium rounded-xl hover:opacity-90 transition-opacity text-sm"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
