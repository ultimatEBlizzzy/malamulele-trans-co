"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertCircle, Loader2 } from "lucide-react"
import { loginAction, registerAction, type AuthState } from "@/app/(auth)/actions"

const field =
  "w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
const label = "block text-sm font-medium text-ink-900"

function Submit({ children }: { children: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Please wait…" : children}
    </button>
  )
}

function ErrorBox({ state }: { state: AuthState }) {
  if (!state?.error) return null
  return (
    <div className="flex items-start gap-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p>{state.error}</p>
    </div>
  )
}

export function RegisterForm() {
  const [state, action] = useActionState<AuthState, FormData>(registerAction, null)
  return (
    <form action={action} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-8">
      <ErrorBox state={state} />
      <div>
        <label className={label} htmlFor="name">Full name *</label>
        <input id="name" name="name" required className={`${field} mt-2`} placeholder="Thabo Nkuna" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={`${field} mt-2`} placeholder="you@company.co.za" />
        </div>
        <div>
          <label className={label} htmlFor="phone">Phone / WhatsApp</label>
          <input id="phone" name="phone" className={`${field} mt-2`} placeholder="082 000 0000" />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="company">Company (optional)</label>
        <input id="company" name="company" className={`${field} mt-2`} placeholder="Nkuna Construction" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="password">Password *</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={`${field} mt-2`} placeholder="At least 8 characters" />
        </div>
        <div>
          <label className={label} htmlFor="confirm">Confirm password *</label>
          <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className={`${field} mt-2`} placeholder="Repeat password" />
        </div>
      </div>
      <Submit>Create my account</Submit>
      <p className="text-center text-sm text-neutral-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">Sign in</Link>
      </p>
    </form>
  )
}

export function LoginForm() {
  const [state, action] = useActionState<AuthState, FormData>(loginAction, null)
  return (
    <form action={action} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-8">
      <ErrorBox state={state} />
      <div>
        <label className={label} htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={`${field} mt-2`} placeholder="you@company.co.za" />
      </div>
      <div>
        <label className={label} htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={`${field} mt-2`} placeholder="Your password" />
      </div>
      <Submit>Sign in</Submit>
      <p className="text-center text-sm text-neutral-600">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-brand-700 hover:underline">Register here</Link>
      </p>
    </form>
  )
}
