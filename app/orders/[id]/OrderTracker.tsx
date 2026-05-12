'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import type { Order, OrderItem, MenuItem, OrderStatus } from '@/types/index'

const steps: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'pending', label: 'Order Placed', description: 'We received your order' },
  { status: 'preparing', label: 'Preparing', description: 'Your order is being made' },
  { status: 'ready', label: 'Ready for Pickup', description: 'Come get your order!' },
  { status: 'completed', label: 'Completed', description: 'Enjoy!' },
]

const statusIndex: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 1,
  ready: 2,
  completed: 3,
}

const badgeVariant: Record<OrderStatus, 'warning' | 'info' | 'success' | 'default'> = {
  pending: 'warning',
  preparing: 'info',
  ready: 'success',
  completed: 'default',
}

type TrackingOrder = Order & { order_items: (OrderItem & { menu_item: MenuItem })[] }

export default function OrderTracker({ initialOrder }: { initialOrder: TrackingOrder }) {
  const [order, setOrder] = useState(initialOrder)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...(payload.new as Partial<Order>) }) as TrackingOrder)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [order.id])

  const currentStep = statusIndex[order.status as OrderStatus] ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-semibold text-espresso-900 dark:text-cream-100">
            Tracking Order
          </h1>
          <p className="font-mono text-xs text-stone-400">{order.id.split('-')[0].toUpperCase()}</p>
        </div>
        <Badge variant={badgeVariant[order.status as OrderStatus]}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      {/* Progress steps */}
      <div className="relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-200 dark:bg-espresso-700" />
        <div
          className="absolute top-4 left-4 h-0.5 bg-caramel-500 transition-all duration-700"
          style={{ width: `${(currentStep / (steps.length - 1)) * (100 - 8)}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step, i) => {
            const done = i <= currentStep
            return (
              <div key={step.status} className="flex flex-col items-center gap-2 max-w-[80px]">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${
                  done
                    ? 'bg-caramel-500 border-caramel-500'
                    : 'bg-white dark:bg-espresso-900 border-stone-200 dark:border-espresso-700'
                }`}>
                  {done && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className={`text-xs text-center font-medium ${done ? 'text-espresso-900 dark:text-cream-100' : 'text-stone-400'}`}>
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current status message */}
      <div className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 text-center space-y-1">
        <p className="font-medium text-espresso-900 dark:text-cream-100">{steps[currentStep]?.label}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">{steps[currentStep]?.description}</p>
        {order.status === 'ready' && (
          <p className="text-sm font-medium text-caramel-500 pt-1">Your order is ready — come pick it up!</p>
        )}
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 space-y-3">
        <h2 className="font-medium text-espresso-900 dark:text-cream-100">Items</h2>
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-stone-600 dark:text-stone-300">
              {item.menu_item?.name} × {item.quantity}
              {item.size && <span className="text-stone-400"> · {item.size}</span>}
              {item.temperature && <span className="text-stone-400"> · {item.temperature}</span>}
            </span>
            <span className="text-espresso-900 dark:text-cream-100">
              ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="pt-2 border-t border-stone-100 dark:border-espresso-700 flex justify-between font-semibold text-sm text-espresso-900 dark:text-cream-100">
          <span>Total</span>
          <span>₱{Number(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <Link href="/orders" className="text-sm text-caramel-500 hover:underline">
        Back to all orders
      </Link>
    </div>
  )
}
