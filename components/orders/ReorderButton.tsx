'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import type { Order, OrderItem, MenuItem } from '@/types/index'

interface Props {
  order: Order & { order_items: (OrderItem & { menu_item: MenuItem })[] }
}

export default function ReorderButton({ order }: Props) {
  const router = useRouter()
  const { items: cartItems, clearCart, addItem } = useCartStore()

  function handleReorder() {
    if (cartItems.length > 0) {
      const confirmed = window.confirm(
        'Your cart has items. Reordering will replace them. Continue?'
      )
      if (!confirmed) return
      clearCart()
    }

    order.order_items.forEach((item) => {
      addItem(
        {
          menuItemId: item.menu_item_id,
          name: item.menu_item?.name ?? 'Item',
          price: Number(item.unit_price),
          image_url: item.menu_item?.image_url ?? null,
          customization: {
            size: item.size,
            sugar_level: item.sugar_level,
            temperature: item.temperature,
          },
        },
        item.quantity
      )
    })

    router.push('/cart')
  }

  return (
    <button
      onClick={handleReorder}
      className="text-xs text-stone-400 hover:text-caramel-500 hover:underline font-medium transition-colors"
    >
      Reorder
    </button>
  )
}
