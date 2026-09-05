import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { isAdmin } from "@/lib/admin-auth"
import { adminLogoutAction } from "@/app/admin/actions"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin()

  // The login page renders its own shell.
  if (!authed) return <>{children}</>

  return (
    <div>
      <div className="border-b border-neutral-200 bg-ink-900 py-8 text-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-400">
              <ShieldCheck className="size-3.5" /> Staff admin
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Operations console</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
            >
              All requests
            </Link>
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="py-12 sm:py-16">
        <div className="container-x">{children}</div>
      </div>
    </div>
  )
}
