import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: Request) {
  const url = new URL(req.url)
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET })
    if (!token || (token as any).role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*','/api/admin/:path*'] }
