'use client'

import { create } from 'zustand'

interface AccountSidebarStore {
  isOpen: boolean
  open:   () => void
  close:  () => void
  toggle: () => void
}

export const useAccountSidebarStore = create<AccountSidebarStore>((set) => ({
  isOpen: false,
  open:   () => set({ isOpen: true }),
  close:  () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}))
