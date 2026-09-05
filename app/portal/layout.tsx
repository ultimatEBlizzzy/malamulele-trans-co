import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, LogOut, Plus } from "lucide-react"
import { currentUser } from "@/lib/auth"
import { logoutAction } from "@/app/(auth)/actions"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  if (!user) redirect("/login")

  return (
    <div>
      <div className="border-b border-neutral-200 bg-ink-900 py-8 text-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-400">Customer portal</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Hello, {user.name.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-neutral-400">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
            >
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
            <Link
              href="/portal/new"
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold hover:bg-brand-700"
            >
              <Plus className="size-4" /> New request
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
              >
                <LogOut className="size-4" /> Sign out
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
