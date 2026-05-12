'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'motion/react'
import { User } from 'lucide-react'
import { useAccountSidebarStore } from '@/store/account-sidebar'
import { useProfileStore } from '@/store/profile'

const NAV_ITEMS = [
  { label: 'My Profile', href: '/profile' },
  { label: 'My Orders',  href: '/orders'  },
]

export default function AccountSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { isOpen, close, toggle } = useAccountSidebarStore()
  const profileStore = useProfileStore()

  useEffect(() => { close() }, [pathname, close])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [close])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!session) return null

  const { email, role } = session.user
  // Use profile store name (updated after saves) with session name as fallback
  const name = profileStore.name ?? session.user.name

  return (
    <>
      {/* ── Trigger tab ─────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        aria-label="Open account menu"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center transition-all duration-200"
        style={{
          width: 28,
          height: 56,
          backgroundColor: isOpen ? 'var(--color-muted)' : 'var(--color-subtle)',
          borderRight: '1px solid var(--color-muted)',
          borderRadius: '0 8px 8px 0',
          color: 'var(--color-accent)',
          boxShadow: '2px 0 8px rgba(28,18,9,0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-muted)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isOpen ? 'var(--color-muted)' : 'var(--color-subtle)'
        }}
      >
        {isOpen ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <User size={14} strokeWidth={2} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={close}
            />

            {/* Panel */}
            <motion.aside
              key="sidebar-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 z-50 h-full flex flex-col"
              style={{
                width: 260,
                backgroundColor: 'var(--color-base)',
                borderRight: '1px solid var(--color-muted)',
                boxShadow: '4px 0 24px rgba(28,18,9,0.12)',
              }}
            >
              {/* User info */}
              <div className="px-6 pt-10 pb-6">
                <p
                  className="text-base font-bold leading-snug"
                  style={{ color: 'var(--color-text)' }}
                >
                  {name || 'My Account'}
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-accent)' }}>
                  {email}
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: 'var(--color-muted)', marginInline: 24 }} />

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 space-y-0.5">
                {[
                  ...NAV_ITEMS,
                  ...(role === 'admin' ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'var(--color-text)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-subtle)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: 'var(--color-muted)', marginInline: 24 }} />

              {/* Sign out */}
              <div className="px-3 py-4">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center w-full px-3 py-3 rounded-xl text-sm transition-colors"
                  style={{ color: 'var(--color-accent)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-subtle)'
                    e.currentTarget.style.color = 'var(--color-text)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
