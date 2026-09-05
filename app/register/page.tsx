import { redirect } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { PageHero } from "@/components/section"
import { RegisterForm } from "@/components/auth-forms"
import { currentUser } from "@/lib/auth"

export const metadata = { title: "Register" }

export default async function RegisterPage() {
  if (await currentUser()) redirect("/portal")

  return (
    <>
      <PageHero
        title="Create your account"
        description="Register once, then log a transport request and follow its progress from submission to delivery."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RegisterForm />
          </div>
          <aside className="h-fit rounded-xl bg-neutral-50 p-8 lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              Why register
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                ["Track every request", "See exactly which stage your load is at, updated by our control room."],
                ["One place for your history", "All past and current jobs with their reference numbers."],
                ["Faster re-bookings", "Your details are saved — new requests take under a minute."],
                ["Quotes on record", "Prices we send you stay attached to the request."],
              ].map(([t, c]) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{t}</p>
                    <p className="text-sm text-neutral-600">{c}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
