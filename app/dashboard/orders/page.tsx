import DashboardOrdersClient from './DashboardOrdersClient'
import { createSupabaseServerClient } from '@/lib/supabase'

export default async function DashboardOrdersPage() {
  const supabase = createSupabaseServerClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, customer:profiles(name, email), order_items(*, menu_item:menu_items(name))')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-espresso-900 dark:text-cream-100">Orders</h1>
        <p className="text-sm text-stone-400 mt-1">Live order management</p>
      </div>
      <DashboardOrdersClient initialOrders={orders ?? []} />
    </div>
  )
}
