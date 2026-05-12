import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  const existingProfile = existing as { id: string } | null
  if (existingProfile) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const password_hash = await bcrypt.hash(password, 12)

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Sign up failed' }, { status: 500 })
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      { id: authData.user.id, email, name, password_hash, role: 'customer' } as never,
      { onConflict: 'id' }
    )

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
