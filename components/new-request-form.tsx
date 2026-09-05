"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertCircle, Loader2 } from "lucide-react"
import { createRequestAction, type RequestState } from "@/app/portal/actions"
import { services } from "@/lib/site"

const field =
  "w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
const label = "block text-sm font-medium text-ink-900"

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Submitting…" : "Submit request"}
    </button>
  )
}

export function NewRequestForm({ defaultService = "" }: { defaultService?: string }) {
  const [state, action] = useActionState<RequestState, FormData>(createRequestAction, null)

  return (
    <form action={action} className="space-y-6 rounded-xl border border-neutral-200 p-8">
      {state?.error && (
        <div className="flex items-start gap-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <div>
        <label className={label} htmlFor="service">Service needed *</label>
        <select id="service" name="service" required defaultValue={defaultService} className={`${field} mt-2`}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>{s.title}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="origin">Collection point *</label>
          <input id="origin" name="origin" required className={`${field} mt-2`} placeholder="Malamulele" />
        </div>
        <div>
          <label className={label} htmlFor="destination">Delivery point *</label>
          <input id="destination" name="destination" required className={`${field} mt-2`} placeholder="Pretoria" />
        </div>
        <div>
          <label className={label} htmlFor="weight">Approx. weight / volume</label>
          <input id="weight" name="weight" className={`${field} mt-2`} placeholder="e.g. 4 500 kg" />
        </div>
        <div>
          <label className={label} htmlFor="date">Preferred date</label>
          <input id="date" name="date" type="date" className={`${field} mt-2`} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="cargo">What are we moving?</label>
        <textarea
          id="cargo"
          name="cargo"
          rows={5}
          className={`${field} mt-2 resize-y`}
          placeholder="Describe the cargo, packaging, loading equipment on site, and anything else we should know."
        />
      </div>

      <Submit />
    </form>
  )
}
