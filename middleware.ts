import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  const customerRoutes = ['/cart', '/checkout', '/order-confirmation', '/orders', '/profile']
  const isCustomerRoute = customerRoutes.some((route) => pathname.startsWith(route))

  if (isCustomerRoute && !token) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/order-confirmation/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
  ],
}
