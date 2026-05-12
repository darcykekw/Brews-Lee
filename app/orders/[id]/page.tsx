import { getServerSession } from 'next-auth/next'
import { redirect, notFound } from 'next/navigation'
import OrderTracker from './OrderTracker'
import { authOptions } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase'

export default async function OrderTrackingPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const supabase = createSupabaseServerClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, menu_item:menu_items(name))')
    .eq('id', params.id)
    .eq('customer_id', session.user.id)
    .single()

  if (!order) notFound()

  return (
    <>      <main className="min-h-screen bg-cream-50 dark:bg-espresso-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <OrderTracker initialOrder={order} />
        </div>
      </main>
    </>
  )
}
