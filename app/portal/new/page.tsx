import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NewRequestForm } from "@/components/new-request-form"

export const metadata = { title: "New request" }

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams

  return (
    <div className="max-w-3xl">
      <Link
        href="/portal"
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-ink-900"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>
      <h2 className="mt-4 text-2xl font-bold text-ink-900">Log a transport request</h2>
      <p className="mt-2 text-sm text-neutral-600">
        You&apos;ll get a reference number immediately and can follow every stage from your
        dashboard. We respond within two working hours.
      </p>
      <div className="mt-8">
        <NewRequestForm defaultService={service ?? ""} />
      </div>
    </div>
  )
}
