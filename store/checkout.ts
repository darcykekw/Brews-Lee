'use client'

import { create } from 'zustand'

interface CheckoutStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  isOpen: false,
  open:  () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
