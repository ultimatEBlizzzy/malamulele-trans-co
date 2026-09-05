import Link from "next/link"
import { ArrowRight, Inbox, Plus } from "lucide-react"
import { currentUser } from "@/lib/auth"
import { listRequests } from "@/lib/store"
import { StatusBadge } from "@/components/status-badge"
import { progressIndex, STATUS_FLOW } from "@/lib/status"
import { services } from "@/lib/site"

export const metadata = { title: "My requests" }
export const dynamic = "force-dynamic"

function serviceLabel(slug: string | null) {
  return services.find((s) => s.slug === slug)?.title ?? slug ?? "—"
}

export default async function PortalPage() {
  const user = (await currentUser())!
  const requests = await listRequests(user.id)

  const active = requests.filter((r) => !["delivered", "cancelled"].includes(r.status))

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total requests", requests.length],
          ["Active jobs", active.length],
          ["Completed", requests.filter((r) => r.status === "delivered").length],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-neutral-200 p-6">
            <p className="text-3xl font-bold text-ink-900">{value as number}</p>
            <p className="mt-1 text-sm text-neutral-600">{label as string}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink-900">Your transport requests</h2>
          <Link
            href="/portal/new"
            className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="size-4" /> New request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 px-8 py-16 text-center">
            <Inbox className="mx-auto size-10 text-neutral-400" />
            <h3 className="mt-4 text-lg font-semibold text-ink-900">No requests yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
              Log your first transport request and you&apos;ll be able to follow it here from
              submission all the way to delivery.
            </p>
            <Link
              href="/portal/new"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Log a request <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {requests.map((r) => {
              const step = progressIndex(r.status)
              const pct =
                r.status === "cancelled" ? 0 : ((step + 1) / STATUS_FLOW.length) * 100
              return (
                <li key={r.id} className="rounded-xl border border-neutral-200 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-ink-900">
                          {r.reference}
                        </span>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="mt-2 text-sm text-neutral-700">
                        {serviceLabel(r.service)} · {r.origin} → {r.destination}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Logged {new Date(r.created_at).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {r.quoted_amount ? ` · Quoted R${r.quoted_amount}` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/portal/requests/${r.reference}`}
                      className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-neutral-50"
                    >
                      Track <ArrowRight className="size-4" />
                    </Link>
                  </div>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
