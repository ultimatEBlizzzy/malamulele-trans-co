import Link from "next/link"
import { Bus, CheckCircle2, Container, KeyRound, Package, Truck, Warehouse } from "lucide-react"
import { PageHero } from "@/components/section"
import { services } from "@/lib/site"

export const metadata = { title: "Services" }

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck,
  Container,
  Package,
  Bus,
  Warehouse,
  KeyRound,
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our services"
        description="Freight, bulk haulage, courier, passenger transport, warehousing and fleet hire — one operator for the whole job."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {services.map((s) => {
            const Icon = icons[s.icon] ?? Truck
            return (
              <div key={s.slug} className="rounded-xl border border-neutral-200 p-8">
                <span className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold text-ink-900">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.summary}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-neutral-700">
                      <CheckCircle2 className="size-4 shrink-0 text-brand-500" /> {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/quote?service=${s.slug}`}
                  className="mt-6 inline-block rounded-md bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
                >
                  Quote this service
                </Link>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
