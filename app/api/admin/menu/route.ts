import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const supabase = createSupabaseAdminClient()

  const { data: item, error } = await supabase
    .from('menu_items')
    .insert(body as never)
    .select('*, category:categories(name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item })
}
