"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LayoutDashboard, Menu, Phone, Truck, X } from "lucide-react"
import { nav, site } from "@/lib/site"
import { cn } from "@/lib/utils"

export function SiteHeader({ userName }: { userName?: string | null }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const signedIn = Boolean(userName)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="hidden bg-ink-900 py-2 text-xs text-neutral-300 md:block">
        <div className="container-x flex items-center justify-between">
          <span>{site.hours}</span>
          <div className="flex items-center gap-5">
            <a className="hover:text-white" href={`tel:${site.phone.replace(/\s/g, "")}`}>
              {site.phone}
            </a>
            <a className="hover:text-white" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Truck className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight">Malamulele</span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
              Trans Co
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-brand-50 text-brand-700" : "text-neutral-600 hover:text-ink-900",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {signedIn ? (
            <Link
              href="/portal"
              className="hidden items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:inline-flex"
            >
              <LayoutDashboard className="size-4" /> My portal
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:text-ink-900 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="hidden rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:inline-flex"
              >
                Register
              </Link>
            </>
          )}
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="inline-flex size-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 sm:hidden"
            aria-label="Call us"
          >
            <Phone className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <nav className="container-x flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-neutral-100 py-3 text-sm font-medium text-neutral-700 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            {signedIn ? (
              <Link
                href="/portal"
                onClick={() => setOpen(false)}
                className="mt-3 mb-3 rounded-md bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                My portal
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-md border border-neutral-300 px-4 py-2.5 text-center text-sm font-semibold text-ink-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="mt-2 mb-3 rounded-md bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
