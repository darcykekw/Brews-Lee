import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'

const navItems = [
  { href: '/dashboard', label: 'Analytics' },
  { href: '/dashboard/orders', label: 'Orders' },
  { href: '/dashboard/menu', label: 'Menu Items' },
  { href: '/dashboard/categories', label: 'Categories' },
  { href: '/dashboard/promo', label: 'Promo Banner' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-espresso-900 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-stone-100 dark:border-espresso-800 bg-white dark:bg-espresso-900 hidden md:flex flex-col">
        <div className="p-5 border-b border-stone-100 dark:border-espresso-800">
          <Link href="/" className="font-serif text-lg font-semibold text-espresso-900 dark:text-cream-100">
            Brews Lee
          </Link>
          <p className="text-xs text-stone-400 mt-0.5">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-lg text-sm text-stone-600 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-espresso-800 hover:text-espresso-900 dark:hover:text-cream-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-100 dark:border-espresso-800">
          <Link href="/" className="text-xs text-stone-400 hover:text-caramel-500 transition-colors">
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden border-b border-stone-100 dark:border-espresso-800 bg-white dark:bg-espresso-900 px-4 py-3 flex items-center gap-4 overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-stone-500 whitespace-nowrap hover:text-espresso-900 dark:hover:text-cream-100">
              {item.label}
            </Link>
          ))}
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
