"use server"

import { redirect } from "next/navigation"
import { hashPassword, startSession, verifyPassword, endSession } from "@/lib/auth"
import { createUser, findUserByEmail } from "@/lib/store"

export type AuthState = { error: string } | null

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim() || null
  const company = String(formData.get("company") ?? "").trim() || null
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")

  if (!name || name.length < 2) return { error: "Please enter your full name." }
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." }
  if (password.length < 8) return { error: "Password must be at least 8 characters." }
  if (password !== confirm) return { error: "The two passwords do not match." }

  try {
    if (await findUserByEmail(email)) {
      return { error: "An account with that email already exists. Try signing in instead." }
    }
    const user = await createUser({
      name,
      email,
      phone,
      company,
      passwordHash: hashPassword(password),
    })
    await startSession(user.id)
  } catch (err) {
    console.error("[register]", err)
    return { error: "We couldn't create your account right now. Please try again." }
  }

  redirect("/portal")
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) return { error: "Enter your email and password." }

  try {
    const user = await findUserByEmail(email)
    if (!user || !verifyPassword(password, user.password_hash)) {
      return { error: "Incorrect email or password." }
    }
    await startSession(user.id)
  } catch (err) {
    console.error("[login]", err)
    return { error: "Sign-in failed. Please try again." }
  }

  redirect("/portal")
}

export async function logoutAction() {
  await endSession()
  redirect("/")
}
