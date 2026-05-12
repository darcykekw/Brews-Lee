import { create } from 'zustand'

interface ProfileState {
  name: string | null
  avatarUrl: string | null
  setProfile: (name: string | null, avatarUrl: string | null) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  name: null,
  avatarUrl: null,
  setProfile: (name, avatarUrl) => set({ name, avatarUrl }),
}))
