import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'AI Explorer',
  description: 'Task → Best free AI tool → Execute here.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role || 'guest'
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto p-6">
          <nav className="nav">
            <Link className="font-semibold" href="/">AI Explorer</Link>
            <div className="flex items-center gap-4 text-sm">
              {role === 'admin' && <Link className="link" href="/admin">Admin</Link>}
              {!session ? (
                <Link className="link" href="/auth/signin">Sign in</Link>
              ) : (
                <form action="/api/auth/signout" method="post">
                  <button className="link" type="submit">Sign out</button>
                </form>
              )}
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  )
}
