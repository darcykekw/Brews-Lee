import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()

  await supabase
    .from('addresses')
    .update({ is_default: false } as never)
    .eq('user_id', session.user.id)

  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true } as never)
    .eq('id', params.id)
    .eq('user_id', session.user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
