"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { submitQuote, type QuoteState } from "@/app/quote/actions"
import { services } from "@/lib/site"

const field =
  "w-full rounded-md border border-neutral-300 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
const label = "block text-sm font-medium text-ink-900"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Sending…" : "Send request"}
    </button>
  )
}

export function QuoteForm() {
  const params = useSearchParams()
  const preset = params.get("service") ?? ""
  const [state, formAction] = useActionState<QuoteState, FormData>(submitQuote, null)

  return (
    <form action={formAction} className="space-y-6 rounded-xl border border-neutral-200 p-8">
      {state && (
        <div
          className={`flex items-start gap-3 rounded-md px-4 py-3 text-sm ${
            state.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {state.ok ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          )}
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">
            Full name *
          </label>
          <input id="name" name="name" required className={`${field} mt-2`} placeholder="Thabo Nkuna" />
        </div>
        <div>
          <label className={label} htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`${field} mt-2`}
            placeholder="you@company.co.za"
          />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Phone / WhatsApp
          </label>
          <input id="phone" name="phone" className={`${field} mt-2`} placeholder="082 000 0000" />
        </div>
        <div>
          <label className={label} htmlFor="service">
            Service needed
          </label>
          <select id="service" name="service" defaultValue={preset} className={`${field} mt-2`}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="origin">
            Collection point
          </label>
          <input id="origin" name="origin" className={`${field} mt-2`} placeholder="Malamulele" />
        </div>
        <div>
          <label className={label} htmlFor="destination">
            Delivery point
          </label>
          <input id="destination" name="destination" className={`${field} mt-2`} placeholder="Pretoria" />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="message">
          Load details
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${field} mt-2 resize-y`}
          placeholder="What are we moving, how heavy is it, and when do you need it there?"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
