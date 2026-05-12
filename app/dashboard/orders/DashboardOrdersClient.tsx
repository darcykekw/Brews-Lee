'use client'

import { useEffect, useState } from 'react'
import Badge from '@/components/ui/Badge'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import type { Order, OrderItem, MenuItem, OrderStatus, Profile } from '@/types/index'

type AdminOrder = Order & {
  customer: Profile
  order_items: (OrderItem & { menu_item: MenuItem })[]
}

const statuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed']

const badgeVariant: Record<OrderStatus, 'warning' | 'info' | 'success' | 'default'> = {
  pending: 'warning',
  preparing: 'info',
  ready: 'success',
  completed: 'default',
}

export default function DashboardOrdersClient({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, async (payload) => {
        const { data } = await supabase
          .from('orders')
          .select('*, customer:profiles(name, email), order_items(*, menu_item:menu_items(name))')
          .eq('id', payload.new.id)
          .single()
        if (data) {
          const newOrder = data as AdminOrder
          setOrders((prev) => [newOrder, ...prev])
          setNewOrderIds((prev) => new Set(prev).add(newOrder.id))
          setTimeout(() => setNewOrderIds((prev) => { const s = new Set(prev); s.delete(newOrder.id); return s }), 5000)
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders((prev) => prev.map((o) => o.id === payload.new.id ? { ...o, ...payload.new } : o))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function updateStatus(orderId: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-stone-400 dark:text-stone-500 py-12 text-center text-sm">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className={`bg-white dark:bg-espresso-800 rounded-2xl border p-5 space-y-4 transition-all ${
              newOrderIds.has(order.id)
                ? 'border-caramel-400 shadow-md shadow-caramel-100 dark:shadow-caramel-900/20'
                : 'border-stone-100 dark:border-espresso-700'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-stone-400">{order.id.split('-')[0].toUpperCase()}</p>
                  {newOrderIds.has(order.id) && (
                    <span className="text-[10px] font-semibold bg-caramel-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">New</span>
                  )}
                </div>
                <p className="text-sm font-medium text-espresso-900 dark:text-cream-100">
                  {order.customer?.name ?? order.customer?.email}
                </p>
                <p className="text-xs text-stone-400">
                  {new Date(order.created_at).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={badgeVariant[order.status as OrderStatus]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                  className="text-xs border border-stone-200 dark:border-espresso-600 rounded-lg px-2 py-1.5 bg-white dark:bg-espresso-700 text-espresso-900 dark:text-cream-100 focus:outline-none focus:ring-1 focus:ring-caramel-400"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              {order.order_items.map((item) => (
                <p key={item.id} className="text-sm text-stone-600 dark:text-stone-300">
                  {item.menu_item?.name} × {item.quantity}
                  {item.size && <span className="text-stone-400"> · {item.size}</span>}
                  {item.temperature && <span className="text-stone-400"> · {item.temperature}</span>}
                  {item.sugar_level && <span className="text-stone-400"> · {item.sugar_level}</span>}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm pt-1 border-t border-stone-100 dark:border-espresso-700">
              <div className="text-stone-500 dark:text-stone-400 space-x-3">
                {order.delivery_address && <span>Deliver to: {order.delivery_address}</span>}
                {order.order_notes && <span>Note: {order.order_notes}</span>}
              </div>
              <p className="font-semibold text-espresso-900 dark:text-cream-100">₱{Number(order.total_amount).toFixed(2)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
