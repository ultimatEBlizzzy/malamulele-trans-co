import { Suspense } from "react"
import { PageHero } from "@/components/section"
import { QuoteForm } from "@/components/quote-form"

export const metadata = { title: "Get a quote" }

export default function QuotePage() {
  return (
    <>
      <PageHero
        title="Request a quote"
        description="Tell us what needs moving. We reply within two working hours with availability and a fixed price."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x max-w-3xl">
          <Suspense fallback={null}>
            <QuoteForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
