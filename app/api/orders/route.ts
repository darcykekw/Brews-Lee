import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase'
import type { CartItem } from '@/types/index'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items, delivery_address, order_notes, total_amount } = await req.json() as {
    items: CartItem[]
    delivery_address: string | null
    order_notes: string | null
    total_amount: number
  }

  if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

  const supabase = createSupabaseServerClient()

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: session.user.id,
      status: 'pending' as const,
      payment_method: 'cash' as const,
      total_amount,
      delivery_address,
      order_notes,
    } as never)
    .select('id')
    .single()

  const order = orderData as { id: string } | null
  if (orderError || !order) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    unit_price: item.price,
    size: item.customization.size,
    sugar_level: item.customization.sugar_level,
    temperature: item.customization.temperature,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems as never)

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id)
    return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 })
  }

  return NextResponse.json({ orderId: order.id })
}
