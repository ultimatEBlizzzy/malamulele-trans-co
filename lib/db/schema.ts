import { pgTable, serial, text, timestamp, varchar, integer, index } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  phone: varchar("phone", { length: 40 }),
  company: varchar("company", { length: 160 }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
})

/** Transport requests raised by a logged-in customer. */
export const requests = pgTable(
  "requests",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 20 }).notNull().unique(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    service: varchar("service", { length: 60 }),
    origin: varchar("origin", { length: 160 }),
    destination: varchar("destination", { length: 160 }),
    cargo: text("cargo"),
    weightKg: varchar("weight_kg", { length: 40 }),
    preferredDate: varchar("preferred_date", { length: 40 }),
    status: varchar("status", { length: 30 }).notNull().default("submitted"),
    quotedAmount: varchar("quoted_amount", { length: 40 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("requests_user_idx").on(t.userId)],
)

/** Timeline entries so the customer can follow progress. */
export const requestUpdates = pgTable("request_updates", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id")
    .notNull()
    .references(() => requests.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 30 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type Request = typeof requests.$inferSelect
export type RequestUpdate = typeof requestUpdates.$inferSelect
