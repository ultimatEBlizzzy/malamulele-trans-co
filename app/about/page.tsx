import { PageHero } from "@/components/section"
import { stats } from "@/lib/site"

export const metadata = { title: "About" }

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Malamulele Trans Co"
        description="A proudly Limpopo-born transport business built on punctuality, safety and straight talk."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5 text-base leading-relaxed text-neutral-700">
            <p>
              Malamulele Trans Co started with a single 8-ton truck running produce between
              Malamulele and the Johannesburg markets. Fifteen years later we operate a mixed fleet
              of forty vehicles and serve clients in construction, agriculture, retail and mining.
            </p>
            <p>
              What hasn&apos;t changed is how we work: we quote honestly, we load carefully, and we
              phone you before you have to phone us. Our drivers are permanently employed, PDP
              licensed and trained in load securing and defensive driving.
            </p>
            <p>
              We are a registered South African operator, fully insured for goods in transit, and
              compliant with the National Road Traffic Act and RTMS safety principles.
            </p>
            <div className="grid gap-6 pt-4 sm:grid-cols-3">
              {[
                ["Our mission", "To move goods and people safely, on time, at a fair price."],
                ["Our people", "Over 60 permanent staff, most of them from the communities we serve."],
                ["Our promise", "If we say the truck will be there, the truck will be there."],
              ].map(([t, c]) => (
                <div key={t} className="rounded-xl border border-neutral-200 p-6">
                  <h3 className="text-sm font-semibold text-ink-900">{t}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{c}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl bg-neutral-50 p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              By the numbers
            </h3>
            <dl className="mt-6 space-y-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-3xl font-bold text-ink-900">{s.value}</dt>
                  <dd className="text-sm text-neutral-600">{s.label}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
    </>
  )
}
