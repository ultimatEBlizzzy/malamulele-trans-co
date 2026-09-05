import "server-only"
import { cookies } from "next/headers"
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { createSession, deleteSession, getSessionUser, type UserRow } from "@/lib/store"

const COOKIE = "mtc_session"
const MAX_AGE_DAYS = 30

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const candidate = scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, "hex")
  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}

export async function startSession(userId: number) {
  const id = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + MAX_AGE_DAYS * 864e5)
  await createSession(id, userId, expires)
  const jar = await cookies()
  jar.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  })
}

export async function endSession() {
  const jar = await cookies()
  const id = jar.get(COOKIE)?.value
  if (id) await deleteSession(id)
  jar.delete(COOKIE)
}

export async function currentUser(): Promise<UserRow | null> {
  const jar = await cookies()
  const id = jar.get(COOKIE)?.value
  if (!id) return null
  try {
    return await getSessionUser(id)
  } catch {
    return null
  }
}
