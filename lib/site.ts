export const site = {
  name: "Malamulele Trans Co",
  tagline: "Moving Limpopo and South Africa forward.",
  description:
    "Malamulele Trans Co is a South African transport and logistics company offering freight, bulk haulage, courier and passenger transport services across all nine provinces.",
  phone: "+27 15 851 0000",
  whatsapp: "+27 82 000 0000",
  email: "bookings@malamuleletrans.co.za",
  address: "12 Giyani Road, Malamulele, Limpopo, 0982",
  hours: "Mon – Fri: 06:00 – 18:00 · Sat: 07:00 – 13:00",
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/fleet", label: "Fleet" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export const services = [
  {
    slug: "freight",
    title: "Road Freight",
    icon: "Truck",
    summary:
      "Full-load and part-load freight between Limpopo, Gauteng and the rest of South Africa.",
    points: ["FTL & LTL loads", "Nationwide line-haul", "Tracked and insured", "Same-week slots"],
  },
  {
    slug: "bulk",
    title: "Bulk & Abnormal Haulage",
    icon: "Container",
    summary: "Sand, stone, grain, timber and construction material moved safely and on schedule.",
    points: ["Tipper & flatbed fleet", "Site-to-site delivery", "Load securing certified", "Permit handling"],
  },
  {
    slug: "courier",
    title: "Courier & Parcels",
    icon: "Package",
    summary: "Fast door-to-door parcel runs for businesses and families across the province.",
    points: ["Next-day regional", "Proof of delivery", "Fragile handling", "Scheduled collections"],
  },
  {
    slug: "passenger",
    title: "Passenger Transport",
    icon: "Bus",
    summary: "Staff shuttles, school runs, funerals and group charters with vetted drivers.",
    points: ["14 – 60 seaters", "PDP-licensed drivers", "Long-distance charters", "Event shuttles"],
  },
  {
    slug: "warehousing",
    title: "Warehousing",
    icon: "Warehouse",
    summary: "Secure short and long-term storage with stock counts and cross-docking.",
    points: ["24/7 security", "Cross-docking", "Stock reporting", "Flexible terms"],
  },
  {
    slug: "fleet-hire",
    title: "Fleet Hire",
    icon: "KeyRound",
    summary: "Vehicles with or without drivers, contracted monthly or per project.",
    points: ["Driver optional", "Maintenance included", "Monthly contracts", "Project rates"],
  },
]

export const fleet = [
  { name: "34-Ton Superlink", capacity: "34 000 kg", use: "Long-haul freight", count: 6 },
  { name: "10-Ton Rigid Truck", capacity: "10 000 kg", use: "Regional distribution", count: 8 },
  { name: "Tipper Truck", capacity: "10 m³", use: "Sand, stone & rubble", count: 5 },
  { name: "Flatbed Trailer", capacity: "12 m deck", use: "Machinery & timber", count: 4 },
  { name: "1-Ton Panel Van", capacity: "1 000 kg", use: "Courier & parcels", count: 10 },
  { name: "22-Seater Bus", capacity: "22 seats", use: "Staff & school shuttles", count: 7 },
]

export const stats = [
  { value: "15+", label: "Years on the road" },
  { value: "40", label: "Vehicles in the fleet" },
  { value: "9", label: "Provinces covered" },
  { value: "98%", label: "On-time deliveries" },
]
