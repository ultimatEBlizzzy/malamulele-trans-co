"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  adminConfigured,
  checkAdminPassword,
  endAdminSession,
  isAdmin,
  startAdminSession,
} from "@/lib/admin-auth"
import { adminUpdateRequest } from "@/lib/store"
import { STATUS_FLOW } from "@/lib/status"

export type AdminLoginState = { error: string } | null

export async function adminLoginAction(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  if (!adminConfigured()) {
    return { error: "ADMIN_PASSWORD is not set on the server. Add it to your .env file." }
  }
  const password = String(formData.get("password") ?? "")
  if (!checkAdminPassword(password)) {
    return { error: "Incorrect staff password." }
  }
  await startAdminSession()
  redirect("/admin")
}

export async function adminLogoutAction() {
  await endAdminSession()
  redirect("/admin/login")
}

export type UpdateState = { error?: string; ok?: string } | null

const ALLOWED = [...STATUS_FLOW, "cancelled"] as readonly string[]

export async function updateRequestAction(
  _prev: UpdateState,
  formData: FormData,
): Promise<UpdateState> {
  if (!(await isAdmin())) redirect("/admin/login")

  const reference = String(formData.get("reference") ?? "")
  const status = String(formData.get("status") ?? "")
  const note = String(formData.get("note") ?? "").trim() || null
  const quotedAmount = String(formData.get("quotedAmount") ?? "").trim() || null

  if (!ALLOWED.includes(status)) return { error: "Please choose a valid status." }

  try {
    const row = await adminUpdateRequest({ reference, status, note, quotedAmount })
    if (!row) return { error: "That request no longer exists." }
  } catch (err) {
    console.error("[admin update]", err)
    return { error: "Could not save the update. Please try again." }
  }

  revalidatePath("/admin")
  revalidatePath(`/admin/requests/${reference}`)
  revalidatePath(`/portal/requests/${reference}`)
  revalidatePath("/portal")
  return { ok: "Update saved — the customer can see it now." }
}
