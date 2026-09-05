import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  service: varchar("service", { length: 60 }),
  origin: varchar("origin", { length: 160 }),
  destination: varchar("destination", { length: 160 }),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type Quote = typeof quotes.$inferSelect
export type NewQuote = typeof quotes.$inferInsert
