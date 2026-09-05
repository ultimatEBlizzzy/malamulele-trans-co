export const STATUS_FLOW = [
  "submitted",
  "reviewing",
  "quoted",
  "confirmed",
  "in_transit",
  "delivered",
] as const

export type Status = (typeof STATUS_FLOW)[number] | "cancelled"

export const STATUS_META: Record<string, { label: string; blurb: string; className: string }> = {
  submitted: {
    label: "Submitted",
    blurb: "We have your request and it's in the queue.",
    className: "bg-neutral-100 text-neutral-700",
  },
  reviewing: {
    label: "Under review",
    blurb: "Our control room is checking vehicle availability.",
    className: "bg-blue-50 text-blue-700",
  },
  quoted: {
    label: "Quote sent",
    blurb: "A price has been prepared — check your email to approve it.",
    className: "bg-amber-50 text-amber-700",
  },
  confirmed: {
    label: "Booking confirmed",
    blurb: "A vehicle and driver are allocated to your load.",
    className: "bg-indigo-50 text-indigo-700",
  },
  in_transit: {
    label: "In transit",
    blurb: "Your cargo is on the road.",
    className: "bg-brand-50 text-brand-700",
  },
  delivered: {
    label: "Delivered",
    blurb: "Delivered and signed for. Thank you!",
    className: "bg-green-50 text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    blurb: "This request was cancelled.",
    className: "bg-red-50 text-red-700",
  },
}

export function statusMeta(status: string) {
  return STATUS_META[status] ?? STATUS_META.submitted
}

export function progressIndex(status: string) {
  const i = (STATUS_FLOW as readonly string[]).indexOf(status)
  return i < 0 ? 0 : i
}
