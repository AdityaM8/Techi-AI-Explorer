'use client'
import { signIn } from 'next-auth/react'
export function SignInButtons() {
  return (
    <div className="flex gap-3">
      <button className="btn" onClick={() => signIn('google')}>Sign in with Google</button>
      <button className="btn" onClick={() => signIn('email')}>Sign in with Email</button>
    </div>
  )
}
