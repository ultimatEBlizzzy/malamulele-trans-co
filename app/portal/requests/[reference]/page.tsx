import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { currentUser } from "@/lib/auth"
import { getRequest, listUpdates } from "@/lib/store"
import { StatusBadge } from "@/components/status-badge"
import { STATUS_FLOW, progressIndex, statusMeta } from "@/lib/status"
import { services, site } from "@/lib/site"
import { cancelRequestAction } from "@/app/portal/actions"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function RequestPage({
  params,
}: {
  params: Promise<{ reference: string }>
}) {
  const { reference } = await params
  const user = await currentUser()
  if (!user) redirect("/login")
  const req = await getRequest(reference, user.id)
  if (!req) notFound()

  const updates = await listUpdates(req.id)
  const current = progressIndex(req.status)
  const cancelled = req.status === "cancelled"
  const closed = cancelled || req.status === "delivered"

  const details: [string, string][] = [
    ["Service", services.find((s) => s.slug === req.service)?.title ?? req.service ?? "—"],
    ["Collection", req.origin ?? "—"],
    ["Delivery", req.destination ?? "—"],
    ["Weight / volume", req.weight_kg ?? "—"],
    ["Preferred date", req.preferred_date ?? "—"],
    ["Quoted amount", req.quoted_amount ? `R${req.quoted_amount}` : "Awaiting quote"],
  ]

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/portal"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-ink-900"
        >
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h2 className="font-mono text-2xl font-bold text-ink-900">{req.reference}</h2>
          <StatusBadge status={req.status} />
        </div>
        <p className="mt-2 text-sm text-neutral-600">{statusMeta(req.status).blurb}</p>
      </div>

      {/* Progress tracker */}
      {!cancelled && (
        <div className="rounded-xl border border-neutral-200 p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            Progress
          </h3>
          <ol className="mt-8 grid gap-6 sm:grid-cols-6">
            {STATUS_FLOW.map((s, i) => {
              const done = i <= current
              return (
                <li key={s} className="relative flex items-start gap-3 sm:block">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      done ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {done ? <Check className="size-4" /> : i + 1}
                  </span>
                  <p
                    className={cn(
                      "text-xs font-semibold sm:mt-3",
                      done ? "text-ink-900" : "text-neutral-400",
                    )}
                  >
                    {statusMeta(s).label}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Details */}
        <div className="rounded-xl border border-neutral-200 p-8 lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            Request details
          </h3>
          <dl className="mt-6 space-y-4">
            {details.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0">
                <dt className="text-sm text-neutral-500">{k}</dt>
                <dd className="text-right text-sm font-medium text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
          {req.cargo && (
            <div className="mt-6">
              <p className="text-sm text-neutral-500">Cargo notes</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-900">{req.cargo}</p>
            </div>
          )}
          {!closed && (
            <form action={cancelRequestAction} className="mt-8">
              <input type="hidden" name="reference" value={req.reference} />
              <button
                type="submit"
                className="text-sm font-semibold text-red-700 hover:underline"
              >
                Cancel this request
              </button>
            </form>
          )}
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-neutral-200 p-8 lg:col-span-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
            Activity timeline
          </h3>
          <ol className="mt-6 space-y-6">
            {updates.map((u, i) => (
              <li key={u.id} className="relative pl-8">
                <span
                  className={cn(
                    "absolute left-0 top-1 size-3 rounded-full ring-4",
                    i === updates.length - 1
                      ? "bg-brand-500 ring-brand-100"
                      : "bg-neutral-300 ring-neutral-100",
                  )}
                />
                {i < updates.length - 1 && (
                  <span className="absolute left-[5px] top-5 h-full w-px bg-neutral-200" />
                )}
                <p className="text-sm font-semibold text-ink-900">{statusMeta(u.status).label}</p>
                {u.note && <p className="mt-1 text-sm text-neutral-600">{u.note}</p>}
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(u.created_at).toLocaleString("en-ZA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-md bg-neutral-50 px-4 py-3 text-xs text-neutral-600">
            Questions about this request? Quote reference{" "}
            <span className="font-mono font-semibold">{req.reference}</span> and call{" "}
            <a className="font-semibold text-brand-700" href={`tel:${site.phone.replace(/\s/g, "")}`}>
              {site.phone}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
