'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import Image from 'next/image'
import { Camera, Check } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile'
import { useProfileStore } from '@/store/profile'
import type { Profile } from '@/types/index'

type FullProfile = Profile & { bio?: string | null; phone?: string | null; banner_url?: string | null }

function getInitials(name?: string | null) {
  if (!name) return '?'
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function ProfileClient({ profile }: { profile: FullProfile | null }) {
  const [name, setName]              = useState(profile?.name ?? '')
  const [avatarSrc, setAvatarSrc]    = useState(profile?.avatar_url ?? null)
  const [avatarFile, setAvatarFile]  = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved]            = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setProfile   = useProfileStore(s => s.setProfile)

  // Seed the sidebar store from server-fetched profile on mount
  useEffect(() => {
    setProfile(profile?.name ?? null, profile?.avatar_url ?? null)
  }, [profile, setProfile])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarSrc(URL.createObjectURL(file))
  }

  function handleSave() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('name', name)
      if (avatarFile) fd.set('avatar', avatarFile)
      try {
        await updateProfile(fd)
        setAvatarFile(null)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
        // Update the sidebar immediately without waiting for a page reload
        setProfile(name || null, avatarSrc)
      } catch (err) {
        console.error('[updateProfile]', err)
        alert(err instanceof Error ? err.message : 'Save failed. Check console.')
      }
    })
  }

  const hasChanges = name !== (profile?.name ?? '') || avatarFile !== null
  const initials   = getInitials(name || profile?.name)

  return (
    <div
      className="rounded-2xl p-8 space-y-6"
      style={{ backgroundColor: 'var(--color-subtle)', border: '1px solid var(--color-muted)' }}
    >
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative group focus:outline-none"
          title="Change profile photo"
        >
          <div
            className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-base)' }}
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="Profile photo"
                width={112}
                height={112}
                className="object-cover w-full h-full"
                unoptimized={avatarFile !== null}
              />
            ) : initials}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={22} strokeWidth={1.8} className="text-white drop-shadow" />
          </div>
        </button>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Click photo to change</p>
        <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={onFileChange} />
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="profile-name" className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          Full Name
        </label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your full name"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: 'var(--color-base)',
            border: '1.5px solid var(--color-muted)',
            color: 'var(--color-text)',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
          onBlur={e =>  (e.currentTarget.style.borderColor = 'var(--color-muted)')}
        />
      </div>

      {/* Email — read only */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Email</label>
        <input
          type="email"
          value={profile?.email ?? ''}
          readOnly
          className="w-full rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: 'var(--color-muted)',
            border: '1.5px solid var(--color-muted)',
            color: 'var(--color-text-muted)',
            cursor: 'default',
          }}
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isPending || (!hasChanges && !saved)}
        className="w-full py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2"
        style={{
          backgroundColor: saved ? 'var(--color-accent)' : 'var(--color-text)',
          color: 'var(--color-base)',
          opacity: (!hasChanges && !saved) ? 0.4 : 1,
          cursor: (!hasChanges && !saved) ? 'default' : 'pointer',
        }}
      >
        {isPending ? (
          <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
        ) : saved ? (
          <><Check size={15} strokeWidth={2.5} /> Saved</>
        ) : 'Save Changes'}
      </button>
    </div>
  )
}
