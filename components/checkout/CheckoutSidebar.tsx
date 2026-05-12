'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'motion/react'
import { X, MapPin, MessageSquare, Banknote, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useCheckoutStore } from '@/store/checkout'
import type { Address } from '@/types/index'

type DeliveryType = 'pickup' | 'delivery'

export default function CheckoutSidebar() {
  const router = useRouter()
  const { data: session } = useSession()
  const { isOpen, close } = useCheckoutStore()
  const { items, getSubtotal, clearCart } = useCartStore()

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [customAddress, setCustomAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = getSubtotal()

  /* Fetch saved addresses when sidebar opens and user is logged in */
  useEffect(() => {
    if (!isOpen || !session) return
    fetch('/api/profile/addresses')
      .then((r) => r.json())
      .then((d) => {
        const list: Address[] = d.addresses ?? []
        setAddresses(list)
        const def = list.find((a) => a.is_default)
        if (def) setSelectedAddressId(def.id)
      })
      .catch(() => {})
  }, [isOpen, session])

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Redirect to login if not authenticated */
  function requireAuth() {
    if (!session) {
      close()
      router.push('/auth/login')
      return false
    }
    return true
  }

  async function handlePlaceOrder() {
    if (!requireAuth()) return
    if (deliveryType === 'delivery') {
      const addr = selectedAddressId
        ? addresses.find((a) => a.id === selectedAddressId)?.full_address
        : customAddress.trim()
      if (!addr) { setError('Please provide a delivery address.'); return }
    }
    if (!items.length) { setError('Your cart is empty.'); return }

    setLoading(true)
    setError('')

    const deliveryAddress = deliveryType === 'pickup'
      ? null
      : selectedAddressId
        ? addresses.find((a) => a.id === selectedAddressId)?.full_address ?? customAddress
        : customAddress

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        delivery_address: deliveryAddress,
        order_notes: notes.trim() || null,
        total_amount: subtotal,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Failed to place order. Please try again.')
      setLoading(false)
      return
    }

    clearCart()
    close()
    router.push(`/order-confirmation?id=${data.orderId}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={close}
          />

          {/* Sidebar panel */}
          <motion.div
            key="checkout-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[var(--color-base)] dark:bg-espresso-900 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-muted)] dark:border-espresso-700 shrink-0">
              <h2 className="font-serif text-xl font-semibold text-espresso-900 dark:text-cream-100">
                Checkout
              </h2>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-muted)] dark:hover:bg-espresso-700 text-stone-400 transition-colors"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* Order summary */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Order Summary
                </h3>
                {items.length === 0 ? (
                  <p className="text-sm text-stone-400">Your cart is empty.</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.cartItemId} className="flex justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-espresso-900 dark:text-cream-100 truncate">
                            {item.name}
                            <span className="ml-1.5 text-stone-400 font-normal">×{item.quantity}</span>
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                            {[item.customization.size, item.customization.temperature, item.customization.sugar_level]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-espresso-900 dark:text-cream-100 shrink-0">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Delivery type */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                  <MapPin size={12} /> Delivery
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['pickup', 'delivery'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setDeliveryType(type)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        deliveryType === type
                          ? 'bg-espresso-900 dark:bg-cream-100 text-white dark:text-espresso-900 border-transparent'
                          : 'border-[var(--color-muted)] dark:border-espresso-700 text-stone-600 dark:text-stone-300 hover:border-[var(--color-accent)]'
                      }`}
                    >
                      {type === 'pickup' ? 'Pickup' : 'Delivery'}
                    </button>
                  ))}
                </div>

                {deliveryType === 'delivery' && (
                  <div className="space-y-2">
                    {addresses.length > 0 ? (
                      <div className="relative">
                        <select
                          value={selectedAddressId}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl text-sm border border-[var(--color-muted)] dark:border-espresso-700 bg-[var(--color-subtle)] dark:bg-espresso-800 text-espresso-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        >
                          <option value="">Select saved address…</option>
                          {addresses.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.label} — {a.full_address}
                            </option>
                          ))}
                          <option value="__custom__">Enter a different address…</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                      </div>
                    ) : null}

                    {(addresses.length === 0 || selectedAddressId === '__custom__') && (
                      <input
                        type="text"
                        placeholder="Enter your full delivery address"
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-sm border border-[var(--color-muted)] dark:border-espresso-700 bg-[var(--color-subtle)] dark:bg-espresso-800 text-espresso-900 dark:text-cream-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                      />
                    )}
                  </div>
                )}
              </section>

              {/* Order notes */}
              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                  <MessageSquare size={12} /> Order Notes
                  <span className="font-normal normal-case text-stone-300">(optional)</span>
                </h3>
                <textarea
                  placeholder="e.g. Less ice, no sugar, extra hot…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border border-[var(--color-muted)] dark:border-espresso-700 bg-[var(--color-subtle)] dark:bg-espresso-800 text-espresso-900 dark:text-cream-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
                />
              </section>

              {/* Payment */}
              <section>
                <div className="flex items-center gap-2.5 px-4 py-3 bg-[var(--color-subtle)] dark:bg-espresso-800 rounded-xl border border-[var(--color-muted)] dark:border-espresso-700">
                  <Banknote size={16} className="text-[var(--color-accent)] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-espresso-900 dark:text-cream-100">Cash on Pickup / Delivery</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">Pay when you receive your order</p>
                  </div>
                </div>
              </section>

            </div>

            {/* Footer — total + button */}
            <div className="shrink-0 border-t border-[var(--color-muted)] dark:border-espresso-700 px-5 py-4 space-y-3 bg-[var(--color-base)] dark:bg-espresso-900">
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-500 dark:text-stone-400">Total</span>
                <span className="font-serif text-xl font-bold text-espresso-900 dark:text-cream-100">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="w-full py-3.5 bg-espresso-900 dark:bg-cream-100 text-white dark:text-espresso-900 font-semibold rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : null}
                {loading ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
