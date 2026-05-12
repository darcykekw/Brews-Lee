import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createSupabaseAdminClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')
  return NextResponse.json({ categories })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const supabase = createSupabaseAdminClient()
  const { data: category, error } = await supabase.from('categories').insert(body as never).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ category })
}
