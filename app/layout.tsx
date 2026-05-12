import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import PromoBanner from '@/components/layout/PromoBanner'
import CartDrawer from '@/components/menu/CartDrawer'
import CheckoutSidebar from '@/components/checkout/CheckoutSidebar'
import AccountSidebar from '@/components/layout/account-sidebar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Brews Lee — Coffee & More',
  description: 'Order your favorite coffee and meals from Brews Lee.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider>
            <PromoBanner />
            <Navbar />
            {children}
            {/* Global overlays — rendered once, controlled by Zustand */}
            <CartDrawer />
            <CheckoutSidebar />
            <AccountSidebar />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
