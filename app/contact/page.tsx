import Link from "next/link"
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { PageHero } from "@/components/section"
import { site } from "@/lib/site"

export const metadata = { title: "Contact" }

export default function ContactPage() {
  const items = [
    { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: site.whatsapp,
      href: `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`,
    },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Yard & office", value: site.address },
    { icon: Clock, label: "Operating hours", value: site.hours },
  ]

  return (
    <>
      <PageHero
        title="Contact us"
        description="Call, WhatsApp or email — someone in the control room answers during operating hours."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <ul className="space-y-4">
            {items.map((i) => (
              <li
                key={i.label}
                className="flex gap-4 rounded-xl border border-neutral-200 px-6 py-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <i.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {i.label}
                  </p>
                  {i.href ? (
                    <a href={i.href} className="text-sm font-medium text-ink-900 hover:text-brand-700">
                      {i.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-ink-900">{i.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-xl bg-ink-900 p-8 text-white">
            <h2 className="text-2xl font-bold">Ready to book a load?</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              The quickest route is our quote form — give us the route, the cargo and the date and
              we&apos;ll reply within two working hours with availability and a fixed price.
            </p>
            <Link
              href="/quote"
              className="mt-6 inline-block rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Open the quote form
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
