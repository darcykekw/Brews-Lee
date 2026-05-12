'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase'

async function session() {
  const s = await getServerSession(authOptions)
  if (!s) throw new Error('Unauthorized')
  return s
}

export async function addAddress(label: string, full_address: string, is_default: boolean) {
  const s = await session()
  const supabase = createSupabaseAdminClient()

  if (is_default) {
    await supabase.from('addresses').update({ is_default: false } as never).eq('user_id', s.user.id)
  }

  const { error } = await supabase.from('addresses').insert({
    user_id: s.user.id, label, full_address, is_default,
  } as never)

  if (error) throw new Error(error.message)
  revalidatePath('/profile')
}

export async function updateAddress(id: string, label: string, full_address: string, is_default: boolean) {
  const s = await session()
  const supabase = createSupabaseAdminClient()

  if (is_default) {
    await supabase.from('addresses').update({ is_default: false } as never).eq('user_id', s.user.id)
  }

  const { error } = await supabase
    .from('addresses')
    .update({ label, full_address, is_default } as never)
    .eq('id', id)
    .eq('user_id', s.user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/profile')
}

export async function deleteAddress(id: string) {
  const s = await session()
  const supabase = createSupabaseAdminClient()

  const { error } = await supabase.from('addresses').delete().eq('id', id).eq('user_id', s.user.id)
  if (error) throw new Error(error.message)
  revalidatePath('/profile')
}

export async function setDefaultAddress(id: string) {
  const s = await session()
  const supabase = createSupabaseAdminClient()

  await supabase.from('addresses').update({ is_default: false } as never).eq('user_id', s.user.id)
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true } as never)
    .eq('id', id)
    .eq('user_id', s.user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/profile')
}
