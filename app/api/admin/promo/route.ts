import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase'
import type { PromoBanner } from '@/types/index'

export async function GET() {
  // Public read — anon client is fine here
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.from('promo_banner').select('*').single()
  const banner = data as PromoBanner | null
  return NextResponse.json({ message: banner?.message ?? '', is_active: banner?.is_active ?? false })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { message, is_active } = await req.json()

  // Must use admin client — NextAuth does not create a Supabase Auth session,
  // so auth.uid() is NULL and RLS blocks writes with the anon client.
  const supabase = createSupabaseAdminClient()

  const { error } = await supabase
    .from('promo_banner')
    .update({ message, is_active } as never)
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Invalidate the cached PromoBanner server component on all pages
  // that include the root layout (which renders <PromoBanner />).
  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true })
}
