"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { currentUser } from "@/lib/auth"
import { cancelRequest, createRequest } from "@/lib/store"

export type RequestState = { error: string } | null

export async function createRequestAction(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const user = await currentUser()
  if (!user) redirect("/login")

  const origin = String(formData.get("origin") ?? "").trim()
  const destination = String(formData.get("destination") ?? "").trim()
  const service = String(formData.get("service") ?? "").trim()

  if (!service) return { error: "Please choose the service you need." }
  if (!origin || !destination) return { error: "Collection and delivery points are both required." }

  let reference: string
  try {
    const row = await createRequest({
      userId: user.id,
      service,
      origin,
      destination,
      cargo: String(formData.get("cargo") ?? "").trim() || null,
      weightKg: String(formData.get("weight") ?? "").trim() || null,
      preferredDate: String(formData.get("date") ?? "").trim() || null,
    })
    reference = row.reference
  } catch (err) {
    console.error("[create request]", err)
    return { error: "We couldn't save your request. Please try again or call us." }
  }

  revalidatePath("/portal")
  redirect(`/portal/requests/${reference}`)
}

export async function cancelRequestAction(formData: FormData) {
  const user = await currentUser()
  if (!user) redirect("/login")
  const reference = String(formData.get("reference") ?? "")
  await cancelRequest(reference, user.id)
  revalidatePath("/portal")
  revalidatePath(`/portal/requests/${reference}`)
}
