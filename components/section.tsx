import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "center" | "left"
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-neutral-600">{description}</p>}
    </div>
  )
}

export function PageHero({ title, description }: { title: string; description?: string }) {
  return (
    <section className="border-b border-neutral-200 bg-ink-900 py-16 text-white sm:py-20">
      <div className="container-x">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-300">{description}</p>
        )}
      </div>
    </section>
  )
}
