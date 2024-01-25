import { NextResponse } from 'next/server'
import { STORAGE_KEYS } from './helper/constant'

const isAuthRoute = (pathname, cookie) => {
  const dynamicPathPattern =
    /^\/(confirm-email-address|confirm-account|reset-password|forgot-password)\/?.*/

  return (
    (pathname.startsWith('/sign') || pathname.match(dynamicPathPattern)) &&
    cookie?.value
  )
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl
  let cookie = req.cookies.get(STORAGE_KEYS.token)

  if (isAuthRoute(pathname, cookie)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/account') && !cookie) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (pathname === '/account' && cookie) {
    return NextResponse.redirect(new URL('/account/profile', req.url))
  }

  if (pathname === '/shop' && !search) {
    return NextResponse.redirect(
      new URL('/shop?sort=position%2CDESC%2CNew+Arrival', req.url)
    )
  }
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/confirm-email-address',
    '/confirm-account',
    '/forgot-password',
    '/reset-password',
    '/account',
    '/account/profile',
    '/account/wishlist',
    '/account/my-orders',
    '/account/support-ticket',
    '/account/manage-address',
    '/shop',
  ],
  // matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
