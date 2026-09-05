import Link from "next/link"
import { PageHero } from "@/components/section"
import { fleet } from "@/lib/site"

export const metadata = { title: "Fleet" }

export default function FleetPage() {
  return (
    <>
      <PageHero
        title="Our fleet"
        description="Every vehicle is serviced in our own workshop and inspected before it leaves the yard."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Capacity</th>
                  <th className="hidden px-6 py-4 font-semibold sm:table-cell">Typical use</th>
                  <th className="px-6 py-4 text-right font-semibold">Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {fleet.map((v) => (
                  <tr key={v.name} className="bg-white">
                    <td className="px-6 py-4 font-medium text-ink-900">{v.name}</td>
                    <td className="px-6 py-4 text-neutral-600">{v.capacity}</td>
                    <td className="hidden px-6 py-4 text-neutral-600 sm:table-cell">{v.use}</td>
                    <td className="px-6 py-4 text-right font-semibold text-brand-700">{v.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-sm text-neutral-600">
            Need something we don&apos;t list?{" "}
            <Link href="/contact" className="font-semibold text-brand-700 hover:underline">
              Talk to us
            </Link>{" "}
            — we source specialised vehicles through vetted partners.
          </p>
        </div>
      </section>
    </>
  )
}
