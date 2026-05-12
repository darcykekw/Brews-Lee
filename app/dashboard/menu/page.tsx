import DashboardMenuClient from './DashboardMenuClient'
import { createSupabaseServerClient } from '@/lib/supabase'

export default async function DashboardMenuPage() {
  const supabase = createSupabaseServerClient()
  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase.from('menu_items').select('*, category:categories(name)').order('name'),
    supabase.from('categories').select('*').order('sort_order'),
  ])

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="font-serif text-2xl font-semibold text-espresso-900 dark:text-cream-100">Menu Items</h1>
      <DashboardMenuClient initialItems={items ?? []} categories={categories ?? []} />
    </div>
  )
}
