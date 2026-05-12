import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Footer from '@/components/layout/Footer'
import ProfileClient from './ProfileClient'
import AddressSection from '@/components/profile/AddressSection'
import { authOptions } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase'
import type { Profile, Address } from '@/types/index'

type FullProfile = Profile & { bio?: string | null; phone?: string | null; banner_url?: string | null }

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const supabase = createSupabaseAdminClient()
  const [{ data: profileData }, { data: addressData }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('addresses').select('*').eq('user_id', session.user.id).order('is_default', { ascending: false }),
  ])

  const profile   = profileData as FullProfile | null
  const addresses = (addressData ?? []) as Address[]

  return (
    <>
      <main className="min-h-screen py-12 px-4 sm:px-6" style={{ backgroundColor: 'var(--color-base)' }}>
        <div className="max-w-2xl mx-auto space-y-6">

          <div>
            <h1 className="font-serif text-3xl font-semibold" style={{ color: 'var(--color-text)' }}>My Profile</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Update your photo and personal details.</p>
          </div>

          {/* Inline profile edit */}
          <ProfileClient profile={profile} />

          {/* Addresses */}
          <AddressSection addresses={addresses} />

        </div>
      </main>
      <Footer />
    </>
  )
}
