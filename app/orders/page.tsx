import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import Badge from '@/components/ui/Badge'
import ReorderButton from '@/components/orders/ReorderButton'
import { authOptions } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase'
import type { Order, OrderItem, MenuItem } from '@/types/index'

const statusBadge: Record<string, 'warning' | 'info' | 'success' | 'default'> = {
  pending: 'warning',
  preparing: 'info',
  ready: 'success',
  completed: 'default',
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const supabase = createSupabaseServerClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, menu_item:menu_items(name, image_url))')
    .eq('customer_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <>      <main className="min-h-screen bg-cream-50 dark:bg-espresso-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="font-serif text-3xl font-semibold text-espresso-900 dark:text-cream-100 mb-8">My Orders</h1>

          {(!orders || orders.length === 0) ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-stone-400 dark:text-stone-500">No orders yet.</p>
              <Link href="/menu" className="text-sm text-caramel-500 hover:underline">Browse the menu</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {(orders as (Order & { order_items: (OrderItem & { menu_item: MenuItem })[] })[]).map((order) => (
                <div key={order.id} className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-stone-400">{order.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500">
                        {new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={statusBadge[order.status] ?? 'default'}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-stone-600 dark:text-stone-300">
                          {item.menu_item?.name} × {item.quantity}
                          {item.size && <span className="text-stone-400"> · {item.size}</span>}
                        </span>
                        <span className="text-espresso-900 dark:text-cream-100">
                          ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-espresso-700">
                    <p className="font-semibold text-sm text-espresso-900 dark:text-cream-100">
                      ₱{Number(order.total_amount).toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      {order.status !== 'completed' && (
                        <Link href={`/orders/${order.id}`} className="text-xs text-caramel-500 hover:underline font-medium">
                          Track Order
                        </Link>
                      )}
                      <ReorderButton order={order} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
