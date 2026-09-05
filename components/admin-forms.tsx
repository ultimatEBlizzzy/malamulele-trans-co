"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import {
  adminLoginAction,
  updateRequestAction,
  type AdminLoginState,
  type UpdateState,
} from "@/app/admin/actions"
import { STATUS_FLOW, statusMeta } from "@/lib/status"

const field =
  "w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
const label = "block text-sm font-medium text-ink-900"

function Submit({ children }: { children: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Saving…" : children}
    </button>
  )
}

export function AdminLoginForm() {
  const [state, action] = useActionState<AdminLoginState, FormData>(adminLoginAction, null)
  return (
    <form action={action} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-8">
      {state?.error && (
        <div className="flex items-start gap-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}
      <div>
        <label className={label} htmlFor="password">Staff password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={`${field} mt-2`}
          placeholder="Enter the staff password"
        />
        <p className="mt-2 text-xs text-neutral-500">
          This is the ADMIN_PASSWORD value from your .env file.
        </p>
      </div>
      <Submit>Sign in to admin</Submit>
    </form>
  )
}

export function UpdateStatusForm({
  reference,
  currentStatus,
  currentQuote,
}: {
  reference: string
  currentStatus: string
  currentQuote: string | null
}) {
  const [state, action] = useActionState<UpdateState, FormData>(updateRequestAction, null)

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="reference" value={reference} />

      {state?.error && (
        <div className="flex items-start gap-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}
      {state?.ok && (
        <div className="flex items-start gap-3 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>{state.ok}</p>
        </div>
      )}

      <div>
        <label className={label} htmlFor="status">Set status</label>
        <select id="status" name="status" defaultValue={currentStatus} className={`${field} mt-2`}>
          {[...STATUS_FLOW, "cancelled"].map((s) => (
            <option key={s} value={s}>{statusMeta(s).label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} htmlFor="quotedAmount">Quoted amount (R)</label>
        <input
          id="quotedAmount"
          name="quotedAmount"
          defaultValue={currentQuote ?? ""}
          className={`${field} mt-2`}
          placeholder="e.g. 8 500"
        />
        <p className="mt-2 text-xs text-neutral-500">Leave blank to keep the existing amount.</p>
      </div>

      <div>
        <label className={label} htmlFor="note">Note for the customer</label>
        <textarea
          id="note"
          name="note"
          rows={4}
          className={`${field} mt-2 resize-y`}
          placeholder="e.g. Vehicle allocated, driver Joseph will collect at 07:00 on Tuesday."
        />
        <p className="mt-2 text-xs text-neutral-500">
          This appears on the customer&apos;s tracking timeline.
        </p>
      </div>

      <Submit>Save update</Submit>
    </form>
  )
}
