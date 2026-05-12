import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', session.user.id)
    .order('is_default', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ addresses: addresses ?? [] })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { label, full_address } = await req.json()
  const supabase = createSupabaseServerClient()

  const { data: address, error } = await supabase
    .from('addresses')
    .insert({ user_id: session.user.id, label, full_address } as never)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ address })
}
