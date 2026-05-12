import Footer from '@/components/layout/Footer'
import MenuClient from './MenuClient'
import { createSupabaseServerClient } from '@/lib/supabase'
import type { Category, MenuItem, ItemCustomization } from '@/types/index'

export const revalidate = 60

async function getData() {
  const supabase = createSupabaseServerClient()

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase
      .from('menu_items')
      .select('*, item_customizations(*), category:categories(name,slug)')
      .eq('is_available', true)
      .order('name'),
  ])

  return {
    categories: (categories as Category[]) ?? [],
    items: (items as (MenuItem & { item_customizations?: ItemCustomization })[]) ?? [],
  }
}

export default async function MenuPage() {
  const { categories, items } = await getData()

  return (
    <>      <main className="min-h-screen bg-cream-50 dark:bg-espresso-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8 space-y-1">
            <h1 className="font-serif text-4xl font-semibold text-espresso-900 dark:text-cream-100">Our Menu</h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Fresh every day. Order your favorites.</p>
          </div>
          <MenuClient categories={categories} items={items} />
        </div>
      </main>
      <Footer />
    </>
  )
}
