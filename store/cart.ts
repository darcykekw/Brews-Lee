'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, CartItemCustomization } from '@/types/index'

interface CartState {
  items: CartItem[]
  isOpen: boolean

  addItem: (item: Omit<CartItem, 'cartItemId' | 'quantity'>, quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

function buildCartItemId(menuItemId: string, customization: CartItemCustomization): string {
  return [
    menuItemId,
    customization.size ?? 'no-size',
    customization.sugar_level ?? 'no-sugar',
    customization.temperature ?? 'no-temp',
  ].join('|')
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (itemData, quantity = 1) => {
        const cartItemId = buildCartItemId(itemData.menuItemId, itemData.customization)

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.cartItemId === cartItemId)

          if (existingIndex >= 0) {
            const updated = [...state.items]
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            }
            return { items: updated }
          }

          return { items: [...state.items, { ...itemData, cartItemId, quantity }] }
        })
      },

      removeItem: (cartItemId) => {
        set((state) => ({ items: state.items.filter((i) => i.cartItemId !== cartItemId) }))
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'brews-lee-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
