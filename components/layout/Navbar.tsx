'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'motion/react'
import { Moon, Sun, ShoppingBag, LogIn } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useScroll } from '@/components/ui/use-scroll'

const NAV_LINKS = [
  { label: 'About Us', href: '/#about' },
  { label: 'Menu',     href: '/menu'   },
]

export default function Navbar() {
  const pathname          = usePathname()
  const scrolled          = useScroll(10)
  const { data: session } = useSession()
  const itemCount         = useCartStore((s) => s.getItemCount())
  const openCart          = useCartStore((s) => s.openCart)

  const [dark, setDark]       = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
    setMounted(true)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0]) && href.split('#')[0] !== '/'

  const iconHover = dark ? 'rgba(255,255,255,0.08)' : 'rgba(28,18,9,0.06)'

  return (
    <>
      {/* ── Main navbar ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 w-full transition-all duration-300"
        style={{
          backgroundColor: dark ? '#1E1410' : '#EFE9E3',
          boxShadow: scrolled
            ? dark
              ? '0 1px 0 #3A2D24, 0 4px 16px rgba(0,0,0,0.3)'
              : '0 1px 0 #D9CFC7, 0 4px 16px rgba(28,18,9,0.06)'
            : 'none',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Left: Wordmark */}
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight shrink-0 hover:opacity-80 transition-opacity"
            style={{ color: dark ? '#F9F8F6' : '#1C1209' }}
          >
            Brews Lee
          </Link>

          {/* Center: Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className="text-sm transition-colors duration-150"
                  style={{
                    color: active
                      ? (dark ? '#F9F8F6' : '#1C1209')
                      : (dark ? '#A89E95' : '#7A6E65'),
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Right: dark mode | cart | sign in | order now */}
          <div className="hidden md:flex items-center gap-3">

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              style={{ color: dark ? '#A89E95' : '#7A6E65' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = iconHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {mounted
                ? dark
                  ? <Sun size={17} strokeWidth={1.8} style={{ color: '#C9B59C' }} />
                  : <Moon size={17} strokeWidth={1.8} />
                : <Moon size={17} strokeWidth={1.8} />}
            </button>

            {/* Cart with badge */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              style={{ color: dark ? '#A89E95' : '#7A6E65' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = iconHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
              {mounted && itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white leading-none px-0.5"
                  style={{ backgroundColor: '#1C1209' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Sign In (only when not logged in) */}
            {!session && (
              <Link
                href="/auth/login"
                className="text-sm transition-colors"
                style={{ color: dark ? '#A89E95' : '#7A6E65' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = dark ? '#F9F8F6' : '#1C1209')}
                onMouseLeave={(e) => (e.currentTarget.style.color = dark ? '#A89E95' : '#7A6E65')}
              >
                Sign In
              </Link>
            )}

            {/* Order Now */}
            <Link
              href="/menu"
              className="px-5 py-2 text-sm font-medium rounded-full transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#1C1209', color: '#F9F8F6' }}
            >
              Order Now
            </Link>

          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openCart}
              className="relative w-9 h-9 flex items-center justify-center rounded-full"
              style={{ color: dark ? '#A89E95' : '#7A6E65' }}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {mounted && itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white px-0.5"
                  style={{ backgroundColor: '#1C1209' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ color: dark ? '#F9F8F6' : '#1C1209' }}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="mob-drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-72 flex flex-col shadow-2xl md:hidden"
              style={{ backgroundColor: dark ? '#1E1410' : '#EFE9E3' }}
            >
              <div
                className="flex items-center justify-between px-5 h-16 border-b"
                style={{ borderColor: dark ? '#3A2D24' : '#D9CFC7' }}
              >
                <span className="font-serif text-lg font-bold" style={{ color: dark ? '#F9F8F6' : '#1C1209' }}>
                  Brews Lee
                </span>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ color: dark ? '#A89E95' : '#7A6E65' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                    className="flex items-center px-3 py-3 rounded-xl text-sm transition-colors"
                    style={{ color: isActive(href) ? '#1C1209' : dark ? '#A89E95' : '#7A6E65' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = dark ? 'rgba(255,255,255,0.05)' : '#D9CFC7')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {label}
                  </Link>
                ))}
                {session && (
                  <>
                    {[
                      { label: 'My Profile', href: '/profile' },
                      { label: 'My Orders',  href: '/orders'  },
                      ...(session.user.role === 'admin' ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
                    ].map(({ label, href }) => (
                      <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3 py-3 rounded-xl text-sm transition-colors"
                        style={{ color: dark ? '#A89E95' : '#7A6E65' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = dark ? 'rgba(255,255,255,0.05)' : '#D9CFC7')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {label}
                      </Link>
                    ))}
                  </>
                )}
              </nav>

              <div className="px-4 py-5 space-y-2 border-t" style={{ borderColor: dark ? '#3A2D24' : '#D9CFC7' }}>
                <button onClick={toggleTheme}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                  style={{ color: dark ? '#A89E95' : '#7A6E65' }}
                >
                  {dark ? <Sun size={15} style={{ color: '#C9B59C' }} /> : <Moon size={15} />}
                  {dark ? 'Light mode' : 'Dark mode'}
                </button>
                {session ? (
                  <button
                    onClick={() => { setMobileOpen(false); /* signOut handled in sidebar */ }}
                    className="w-full flex items-center justify-center px-4 py-2.5 rounded-full text-sm border"
                    style={{ borderColor: dark ? '#3A2D24' : '#D9CFC7', color: dark ? '#A89E95' : '#7A6E65' }}
                  >
                    Account
                  </button>
                ) : (
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm border"
                    style={{ borderColor: dark ? '#3A2D24' : '#D9CFC7', color: dark ? '#A89E95' : '#7A6E65' }}
                  >
                    <LogIn size={13} /> Sign In
                  </Link>
                )}
                <Link href="/menu" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-full text-sm font-medium"
                  style={{ backgroundColor: '#1C1209', color: '#F9F8F6' }}
                >
                  Order Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
