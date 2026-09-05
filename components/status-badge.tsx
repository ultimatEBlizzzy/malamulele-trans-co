import { statusMeta } from "@/lib/status"
import { cn } from "@/lib/utils"

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = statusMeta(status)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  )
}
