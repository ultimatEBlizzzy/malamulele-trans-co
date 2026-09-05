import Link from "next/link"
import {
  ArrowRight,
  Bus,
  CheckCircle2,
  Clock,
  Container,
  KeyRound,
  Package,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react"
import { SectionHeading } from "@/components/section"
import { fleet, services, site, stats } from "@/lib/site"

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck,
  Container,
  Package,
  Bus,
  Warehouse,
  KeyRound,
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_10%,rgba(254,125,18,0.28),transparent_60%)]" />
        <div className="container-x relative grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-300">
              <ShieldCheck className="size-3.5" /> Licensed &amp; fully insured operator
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
              Reliable transport for{" "}
              <span className="text-brand-500">Limpopo and beyond</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
              {site.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/portal/new"
                className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Log a request <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore services
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-bold text-white sm:text-3xl">{s.value}</dt>
                  <dd className="mt-1 text-xs text-neutral-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
                Why shippers choose us
              </h3>
              <ul className="mt-6 space-y-5">
                {[
                  ["Live tracking on every load", "Know where your freight is, hour by hour."],
                  ["Cargo insured up to R2m", "Peace of mind on high-value consignments."],
                  ["Own maintenance workshop", "Fewer breakdowns, fewer missed deadlines."],
                  ["Local drivers, local knowledge", "Routes across Limpopo we know by heart."],
                ].map(([title, copy]) => (
                  <li key={title} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" />
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-sm text-neutral-400">{copy}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we do"
            title="Transport solutions built around your cargo"
            description="From a single pallet to a full superlink load, we plan, move and deliver with the same discipline."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = icons[s.icon] ?? Truck
              return (
                <div
                  key={s.slug}
                  className="group rounded-xl border border-neutral-200 bg-white p-7 transition-shadow hover:shadow-lg"
                >
                  <span className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.summary}</p>
                  <ul className="mt-5 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-neutral-700">
                        <CheckCircle2 className="size-4 text-brand-500" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Fleet strip */}
      <section className="border-y border-neutral-200 bg-neutral-50 py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our fleet"
            title="40 vehicles, maintained in-house"
            description="Right-sized vehicles for every job, serviced on schedule and checked before each trip."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.map((v) => (
              <div
                key={v.name}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-900">{v.name}</p>
                  <p className="text-xs text-neutral-500">
                    {v.capacity} · {v.use}
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  ×{v.count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              See the full fleet <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title="Booking a load takes three steps" />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              ["Tell us the job", "Send the pickup, drop-off, weight and dates. We reply within 2 hours."],
              ["Approve the quote", "A fixed, all-in price — no surprise fuel or waiting fees."],
              ["Track to delivery", "We collect on time and keep you updated until it's signed for."],
            ].map(([title, copy], i) => (
              <div key={title} className="relative rounded-xl border border-neutral-200 p-7">
                <span className="flex size-10 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x">
        <div className="overflow-hidden rounded-2xl bg-brand-600 px-8 py-14 text-white sm:px-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Need a truck this week?
              </h2>
              <p className="mt-3 text-brand-50">
                Register, log your request, and track it from submission to delivery.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-brand-100">
                <Clock className="size-4" /> {site.hours}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/portal/new"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                Log a request
              </Link>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
