import "server-only"
import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "node:crypto"

const COOKIE = "mtc_admin"
const MAX_AGE_HOURS = 12

function secret() {
  return process.env.ADMIN_PASSWORD ?? ""
}

/** Signed token: <expiry>.<hmac(expiry)> — no server-side storage needed. */
function sign(expiry: number) {
  return createHmac("sha256", secret()).update(String(expiry)).digest("hex")
}

export function makeAdminToken() {
  const expiry = Date.now() + MAX_AGE_HOURS * 3600_000
  return `${expiry}.${sign(expiry)}`
}

export function verifyAdminToken(token: string | undefined) {
  if (!token || !secret()) return false
  const [rawExpiry, mac] = token.split(".")
  const expiry = Number(rawExpiry)
  if (!expiry || !mac || Date.now() > expiry) return false
  const expected = Buffer.from(sign(expiry), "hex")
  const given = Buffer.from(mac, "hex")
  return expected.length === given.length && timingSafeEqual(expected, given)
}

export function checkAdminPassword(password: string) {
  const s = secret()
  if (!s) return false
  const a = Buffer.from(password)
  const b = Buffer.from(s)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function startAdminSession() {
  const jar = await cookies()
  jar.set(COOKIE, makeAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_HOURS * 3600,
  })
}

export async function endAdminSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function isAdmin() {
  const jar = await cookies()
  return verifyAdminToken(jar.get(COOKIE)?.value)
}

export function adminConfigured() {
  return Boolean(secret())
}
