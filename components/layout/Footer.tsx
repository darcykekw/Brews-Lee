import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone-100 dark:border-espresso-800 bg-cream-100 dark:bg-espresso-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <p className="font-serif text-xl font-semibold text-espresso-900 dark:text-cream-100">Brews Lee</p>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Your neighborhood coffee shop. Handcrafted drinks and meals made with care.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">Navigation</p>
          <ul className="space-y-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'Menu', href: '/menu' },
              { label: 'My Orders', href: '/orders' },
              { label: 'Profile', href: '/profile' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-stone-500 dark:text-stone-400 hover:text-espresso-900 dark:hover:text-cream-100 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">Contact</p>
          <ul className="space-y-2 text-sm text-stone-500 dark:text-stone-400">
            <li>123 Cafe Street, Palawan</li>
            <li>hello@brewslee.com</li>
            <li>+63 912 345 6789</li>
          </ul>
          <div className="flex gap-3 pt-1">
            {['Facebook', 'Instagram'].map((platform) => (
              <a
                key={platform}
                href="#"
                className="text-xs text-stone-400 dark:text-stone-500 hover:text-caramel-500 transition-colors"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-stone-100 dark:border-espresso-800 py-4 text-center text-xs text-stone-400 dark:text-stone-500">
        {new Date().getFullYear()} Brews Lee. All rights reserved.
      </div>
    </footer>
  )
}
