import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { createSupabaseAdminClient } from '@/lib/supabase'
import type { Profile } from '@/types/index'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const supabase = createSupabaseAdminClient()

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', credentials.email)
          .single()

        const profile = data as Profile | null

        if (error || !profile) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          profile.password_hash ?? ''
        )

        if (!passwordMatch) return null

        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
          role: profile.role,
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const supabase = createSupabaseAdminClient()

        // Check if a profile already exists for this email
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email!)
          .maybeSingle()

        if (!existing) {
          // Create a Supabase Auth user to get a proper UUID (profiles.id FK requires it)
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: user.email!,
            email_confirm: true,
            user_metadata: { full_name: user.name ?? '' },
          })

          if (authError || !authData.user) {
            console.error('[NextAuth signIn] Supabase user creation failed:', authError)
            return false
          }

          const { error } = await supabase.from('profiles').upsert(
            {
              id: authData.user.id,
              email: user.email!,
              name: user.name ?? '',
              avatar_url: user.image ?? null,
              role: 'customer' as const,
              password_hash: null,
            } as never,
            { onConflict: 'id' }
          )

          if (error) {
            console.error('[NextAuth signIn] Profile upsert failed:', error)
            return false
          }
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? 'customer'
      }

      // For Google OAuth, look up the real Supabase UUID by email (only on initial sign-in
      // when account is present, so we don't hit the DB on every token refresh)
      if (account?.provider === 'google' && token.email) {
        const supabase = createSupabaseAdminClient()
        const { data } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('email', token.email as string)
          .single()

        const profile = data as { id: string; role: string } | null
        if (profile) {
          token.id   = profile.id
          token.role = profile.role
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'customer' | 'admin'
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
}
