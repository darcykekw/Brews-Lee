'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase'

async function uploadFile(supabase: ReturnType<typeof createSupabaseAdminClient>, file: File, path: string) {
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return `${data.publicUrl}?t=${Date.now()}`
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  const supabase = createSupabaseAdminClient()
  const uid = session.user.id

  const updates: Record<string, string> = {}

  const name   = (formData.get('name')  as string | null)?.trim()
  const bio    = (formData.get('bio')   as string | null)?.trim()
  const phone  = (formData.get('phone') as string | null)?.trim()

  if (name  !== null && name  !== undefined) updates.name  = name
  if (bio   !== null && bio   !== undefined) updates.bio   = bio
  if (phone !== null && phone !== undefined) updates.phone = phone

  const avatarFile = formData.get('avatar') as File | null
  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split('.').pop() ?? 'jpg'
    const url = await uploadFile(supabase, avatarFile, `${uid}/avatar.${ext}`)
    if (url) updates.avatar_url = url
  }

  const bannerFile = formData.get('banner') as File | null
  if (bannerFile && bannerFile.size > 0) {
    const ext = bannerFile.name.split('.').pop() ?? 'jpg'
    const url = await uploadFile(supabase, bannerFile, `${uid}/banner.${ext}`)
    if (url) updates.banner_url = url
  }

  // Always include email so upsert can recover a missing profile row.
  // Fetch existing role so we never demote an admin back to customer.
  updates.email = session.user.email!

  const { data: existing } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', uid)
    .maybeSingle()

  const role = (existing as { role: string } | null)?.role ?? 'customer'

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: uid, role, ...updates } as never, { onConflict: 'id' })
  if (error) throw new Error(error.message)

  revalidatePath('/profile')
}
