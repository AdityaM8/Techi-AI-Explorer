import { getProviders } from 'next-auth/react'
import { SignInButtons } from '@/components/SignInButtons'

export default async function SignInPage() {
  const providers = await getProviders()
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <SignInButtons />
      <p className="hint">Use Google OAuth or, in demo mode, email-only dev sign-in.</p>
    </main>
  )
}
