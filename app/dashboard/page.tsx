import { createSupabaseServerClient } from '@/lib/supabase'

async function getAnalytics() {
  const supabase = createSupabaseServerClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [{ data: todayOrders }, { data: allOrders }, { data: bestSellers }] = await Promise.all([
    supabase.from('orders').select('*').gte('created_at', today.toISOString()),
    supabase.from('orders').select('id').neq('status', 'completed'),
    supabase.from('order_items').select('*, menu_item:menu_items(name)').limit(200),
  ])

  type OrderRow = { total_amount: number }
  type BestSellerRow = { menu_item_id: string; quantity: number; menu_item: { name: string } | null }

  const todayRevenue = ((todayOrders as OrderRow[]) ?? []).reduce((sum, o) => sum + Number(o.total_amount), 0)
  const todayCount = todayOrders?.length ?? 0
  const activeOrders = allOrders?.length ?? 0

  const itemMap = new Map<string, { name: string; qty: number }>()
  ;((bestSellers as BestSellerRow[]) ?? []).forEach((row) => {
    const name = row.menu_item?.name ?? 'Unknown'
    const existing = itemMap.get(row.menu_item_id)
    if (existing) existing.qty += row.quantity
    else itemMap.set(row.menu_item_id, { name, qty: row.quantity })
  })
  const top = Array.from(itemMap.values()).sort((a, b) => b.qty - a.qty).slice(0, 5)

  return { todayRevenue, todayCount, activeOrders, top }
}

export default async function DashboardPage() {
  const { todayRevenue, todayCount, activeOrders, top } = await getAnalytics()

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-espresso-900 dark:text-cream-100">Analytics</h1>
        <p className="text-sm text-stone-400 mt-1">Today's overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Today's Revenue", value: `₱${todayRevenue.toFixed(2)}` },
          { label: "Today's Orders", value: todayCount },
          { label: 'Active Orders', value: activeOrders },
        ].map((card) => (
          <div key={card.label} className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 space-y-1">
            <p className="text-xs text-stone-400 uppercase tracking-wide">{card.label}</p>
            <p className="font-serif text-3xl font-semibold text-espresso-900 dark:text-cream-100">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-5 space-y-4">
        <h2 className="font-medium text-espresso-900 dark:text-cream-100">Best Sellers</h2>
        {top.length === 0 ? (
          <p className="text-sm text-stone-400">No order data yet.</p>
        ) : (
          <div className="space-y-3">
            {top.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-5 text-xs text-stone-400 text-right">{i + 1}</span>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-espresso-900 dark:text-cream-100">{item.name}</span>
                  <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{item.qty} sold</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
