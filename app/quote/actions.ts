"use server"

import { getDb, schema } from "@/lib/db"

export type QuoteState = { ok: boolean; message: string } | null

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()

  if (!name || !email) {
    return { ok: false, message: "Please provide at least your name and email address." }
  }

  const payload = {
    name,
    email,
    phone: String(formData.get("phone") ?? "").trim() || null,
    service: String(formData.get("service") ?? "").trim() || null,
    origin: String(formData.get("origin") ?? "").trim() || null,
    destination: String(formData.get("destination") ?? "").trim() || null,
    message: String(formData.get("message") ?? "").trim() || null,
  }

  const db = getDb()
  if (!db) {
    console.log("[quote] no DATABASE_URL configured, request logged only:", payload)
    return { ok: true, message: "Thanks! Your request was received — we'll be in touch shortly." }
  }

  try {
    await db.insert(schema.quotes).values(payload)
    return { ok: true, message: "Thanks! Your request is in — we reply within 2 working hours." }
  } catch (err) {
    console.error("[quote] insert failed", err)
    return { ok: false, message: "Something went wrong saving your request. Please call us instead." }
  }
}
