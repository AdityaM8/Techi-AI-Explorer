import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'database' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER || '',
      from: process.env.EMAIL_FROM || 'no-reply@localhost',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      (session.user as any).id = user.id
      ;(session.user as any).role = (user as any).role || 'user'
      return session
    },
    async signIn({ user }) {
      // Assign admin role if email is in ADMIN_EMAILS
      const admins = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean)
      if (user.email && admins.includes(user.email)) {
        await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } }).catch(()=>{})
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
}
