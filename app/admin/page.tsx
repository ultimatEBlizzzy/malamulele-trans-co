import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, Inbox } from "lucide-react"
import { isAdmin } from "@/lib/admin-auth"
import { adminListRequests, adminStats, storageMode } from "@/lib/store"
import { StatusBadge } from "@/components/status-badge"
import { services } from "@/lib/site"

export const metadata = { title: "Admin" }
export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login")

  const [rows, stats, mode] = await Promise.all([
    adminListRequests(),
    adminStats(),
    storageMode(),
  ])

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total requests", stats.total],
          ["Open jobs", stats.open],
          ["Awaiting review", stats.needsAction],
          ["Registered customers", stats.customers],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-neutral-200 p-6">
            <p className="text-3xl font-bold text-ink-900">{value as number}</p>
            <p className="mt-1 text-sm text-neutral-600">{label as string}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-ink-900">All customer requests</h2>
        <p className="mt-1 text-sm text-neutral-500">Storage: {mode}</p>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 px-8 py-16 text-center">
            <Inbox className="mx-auto size-10 text-neutral-400" />
            <h3 className="mt-4 text-lg font-semibold text-ink-900">No requests yet</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Once a customer registers and logs a request it will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Reference</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="hidden px-5 py-4 font-semibold lg:table-cell">Route</th>
                  <th className="hidden px-5 py-4 font-semibold sm:table-cell">Service</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {rows.map((r) => (
                  <tr key={r.id} className="bg-white">
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-ink-900">
                      {r.reference}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink-900">{r.customer_name}</p>
                      <p className="text-xs text-neutral-500">{r.customer_email}</p>
                    </td>
                    <td className="hidden px-5 py-4 text-neutral-600 lg:table-cell">
                      {r.origin} → {r.destination}
                    </td>
                    <td className="hidden px-5 py-4 text-neutral-600 sm:table-cell">
                      {services.find((s) => s.slug === r.service)?.title ?? r.service ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/requests/${r.reference}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
                      >
                        Open <ArrowRight className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
