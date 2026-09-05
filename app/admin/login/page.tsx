import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { AdminLoginForm } from "@/components/admin-forms"
import { isAdmin } from "@/lib/admin-auth"

export const metadata = { title: "Staff sign in" }

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin")

  return (
    <div className="py-20">
      <div className="container-x max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-ink-900 text-white">
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-ink-900">Staff access</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Internal use only. Customers should{" "}
            <a href="/login" className="font-semibold text-brand-700 hover:underline">
              sign in here
            </a>
            .
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
