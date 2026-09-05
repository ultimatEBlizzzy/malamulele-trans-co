import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { isAdmin } from "@/lib/admin-auth"
import { adminGetRequest, listUpdates } from "@/lib/store"
import { StatusBadge } from "@/components/status-badge"
import { UpdateStatusForm } from "@/components/admin-forms"
import { statusMeta } from "@/lib/status"
import { services } from "@/lib/site"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminRequestPage({
  params,
}: {
  params: Promise<{ reference: string }>
}) {
  if (!(await isAdmin())) redirect("/admin/login")

  const { reference } = await params
  const req = await adminGetRequest(reference)
  if (!req) notFound()

  const updates = await listUpdates(req.id)

  const details: [string, string][] = [
    ["Service", services.find((s) => s.slug === req.service)?.title ?? req.service ?? "—"],
    ["Collection", req.origin ?? "—"],
    ["Delivery", req.destination ?? "—"],
    ["Weight / volume", req.weight_kg ?? "—"],
    ["Preferred date", req.preferred_date ?? "—"],
    ["Quoted amount", req.quoted_amount ? `R${req.quoted_amount}` : "Not quoted yet"],
  ]

  const customer: [string, string][] = [
    ["Name", req.customer_name],
    ["Email", req.customer_email],
    ["Phone", req.customer_phone ?? "—"],
    ["Company", req.customer_company ?? "—"],
  ]

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-ink-900"
        >
          <ArrowLeft className="size-4" /> All requests
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h2 className="font-mono text-2xl font-bold text-ink-900">{req.reference}</h2>
          <StatusBadge status={req.status} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          <div className="rounded-xl border border-neutral-200 p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              Advance this request
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Changing the status here immediately updates the customer&apos;s tracking page.
            </p>
            <div className="mt-6">
              <UpdateStatusForm
                reference={req.reference}
                currentStatus={req.status}
                currentQuote={req.quoted_amount}
              />
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 p-8">
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
          </div>
        </div>

        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              Customer
            </h3>
            <dl className="mt-6 space-y-4">
              {customer.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-neutral-100 pb-3 last:border-0">
                  <dt className="text-sm text-neutral-500">{k}</dt>
                  <dd className="break-all text-right text-sm font-medium text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-neutral-200 p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
              Load details
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
          </div>
        </div>
      </div>
    </div>
  )
}
