import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const supabase = createSupabaseAdminClient()

  const { data, error } = await supabase
    .from('menu_items')
    .update(body as never)
    .eq('id', params.id)
    .select('*, category:categories(name)')
    .single()

  const item = data as Record<string, unknown> | null
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from('menu_items').delete().eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
