import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { site } from "@/lib/site"
import { currentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Transport & Logistics`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader userName={user?.name ?? null} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
