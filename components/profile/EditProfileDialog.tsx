'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCharacterLimit } from '@/components/hooks/use-character-limit'
import { useImageUpload } from '@/components/hooks/use-image-upload'
import { updateProfile } from '@/app/actions/profile'
import type { Profile } from '@/types/index'

type FullProfile = Profile & { bio?: string | null; phone?: string | null; banner_url?: string | null }

function FieldInput({
  id, label, value, onChange, type = 'text', readOnly, placeholder,
}: {
  id: string; label: string; value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string; readOnly?: boolean; placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} style={{ color: 'var(--color-text)' }}>{label}</Label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        readOnly={readOnly} placeholder={placeholder}
        className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
        style={{
          backgroundColor: readOnly ? 'var(--color-muted)' : 'var(--color-base)',
          border: '1.5px solid var(--color-muted)',
          color: readOnly ? 'var(--color-text-muted)' : 'var(--color-text)',
          cursor: readOnly ? 'default' : undefined,
        }}
        onFocus={(e) => { if (!readOnly) e.currentTarget.style.borderColor = 'var(--color-accent)' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-muted)' }}
      />
    </div>
  )
}

function getInitials(name?: string | null) {
  if (!name) return '?'
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function EditProfileDialog({ profile }: { profile: FullProfile }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null)

  const [name,  setName]  = useState(profile.name  ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const bio    = useCharacterLimit({ maxLength: 180, initialValue: profile.bio ?? '' })
  const avatar = useImageUpload()
  const banner = useImageUpload()

  function showToast(ok: boolean, msg: string) {
    setToast({ ok, msg })
    setTimeout(() => setToast(null), 3000)
  }

  function handleSave() {
    const fd = new FormData()
    fd.set('name', name); fd.set('bio', bio.value); fd.set('phone', phone)
    if (avatar.file) fd.set('avatar', avatar.file)
    if (banner.file) fd.set('banner', banner.file)

    startTransition(async () => {
      try {
        await updateProfile(fd)
        avatar.resetImage(); banner.resetImage()
        showToast(true, 'Profile saved.')
        setOpen(false)
      } catch (err) {
        showToast(false, err instanceof Error ? err.message : 'Save failed.')
      }
    })
  }

  const currentAvatar = avatar.previewUrl ?? profile.avatar_url
  const currentBanner = banner.previewUrl ?? profile.banner_url
  const initials = getInitials(profile.name)

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-full text-sm font-medium shadow-lg pointer-events-none"
          style={{ backgroundColor: toast.ok ? 'var(--color-text)' : '#ef4444', color: 'var(--color-base)' }}
        >
          {toast.msg}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="px-5 py-2 text-sm font-semibold rounded-full hover:opacity-85 transition-opacity"
            style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-base)' }}
          >
            Edit Profile
          </button>
        </DialogTrigger>

        <DialogContent
          className="mx-4"
          style={{ backgroundColor: 'var(--color-subtle)', border: '1px solid var(--color-muted)' }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          {/* Banner */}
          <div
            className="relative h-32 rounded-t-2xl overflow-hidden cursor-pointer group"
            onClick={banner.triggerFileInput}
            style={{ backgroundColor: 'var(--color-muted)' }}
          >
            {currentBanner && <Image src={currentBanner} alt="Banner" fill className="object-cover" />}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <Camera size={22} strokeWidth={1.8} className="text-white drop-shadow" />
            </div>
            <input ref={banner.inputRef} type="file" accept="image/*" className="hidden" onChange={banner.handleFileChange} />
          </div>

          {/* Avatar */}
          <div className="flex justify-center -mt-10 relative z-10 mb-1">
            <button type="button" onClick={avatar.triggerFileInput} className="relative group">
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-lg font-bold border-4"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-base)', borderColor: 'var(--color-subtle)' }}
              >
                {currentAvatar
                  ? <Image src={currentAvatar} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                  : initials}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={16} strokeWidth={2} className="text-white" />
              </div>
            </button>
            <input ref={avatar.inputRef} type="file" accept="image/*" className="hidden" onChange={avatar.handleFileChange} />
          </div>

          {/* Fields */}
          <div className="px-6 pb-2 space-y-4">
            <FieldInput id="name"  label="Full Name"    value={name}  onChange={e => setName(e.target.value)}  placeholder="Your full name" />
            <FieldInput id="email" label="Email"        value={profile.email} readOnly type="email" />
            <FieldInput id="phone" label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+63 912 345 6789" type="tel" />

            <div className="space-y-1.5">
              <Label htmlFor="bio" style={{ color: 'var(--color-text)' }}>Bio</Label>
              <Textarea
                id="bio"
                value={bio.value}
                onChange={bio.handleChange}
                placeholder="Tell us a little about yourself…"
                rows={3}
                characterCount={bio.characterCount}
                maxLength={180}
              />
            </div>
          </div>

          <DialogFooter style={{ borderColor: 'var(--color-muted)' }}>
            <button
              onClick={() => setOpen(false)}
              className="px-5 py-2 text-sm rounded-full transition-colors"
              style={{ border: '1.5px solid var(--color-muted)', color: 'var(--color-text-muted)', backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-muted)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-5 py-2 text-sm font-semibold rounded-full hover:opacity-85 disabled:opacity-50 flex items-center gap-2 transition-opacity"
              style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-base)' }}
            >
              {isPending && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
