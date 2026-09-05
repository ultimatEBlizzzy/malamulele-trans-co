/**
 * Data access for the customer portal.
 *
 * Uses Postgres when DATABASE_URL is set AND reachable; otherwise falls back to
 * a JSON file under .data/ so the app is fully usable in local/preview mode.
 */
import "server-only"
import fs from "node:fs/promises"
import path from "node:path"
import { Pool } from "pg"

export type UserRow = {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  password_hash: string
  created_at: string
}

export type RequestRow = {
  id: number
  reference: string
  user_id: number
  service: string | null
  origin: string | null
  destination: string | null
  cargo: string | null
  weight_kg: string | null
  preferred_date: string | null
  status: string
  quoted_amount: string | null
  created_at: string
  updated_at: string
}

export type UpdateRow = {
  id: number
  request_id: number
  status: string
  note: string | null
  created_at: string
}

type SessionRow = { id: string; user_id: number; expires_at: string }

type FileShape = {
  seq: { users: number; requests: number; updates: number }
  users: UserRow[]
  sessions: SessionRow[]
  requests: RequestRow[]
  updates: UpdateRow[]
}

const DATA_FILE = path.join(process.cwd(), ".data", "portal.json")

let pool: Pool | null = null
let pgReady: boolean | null = null

async function tryPg(): Promise<Pool | null> {
  if (pgReady === false) return null
  if (pool && pgReady) return pool
  if (!process.env.DATABASE_URL) {
    pgReady = false
    return null
  }
  try {
    pool =
      pool ??
      new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 4000,
        max: 3,
      })
    pool.on("error", () => {})
    await pool.query("select 1")
    await ensureTables(pool)
    pgReady = true
    return pool
  } catch {
    pgReady = false
    return null
  }
}

async function ensureTables(p: Pool) {
  await p.query(`
    create table if not exists users (
      id serial primary key,
      name varchar(120) not null,
      email varchar(160) not null unique,
      phone varchar(40),
      company varchar(160),
      password_hash varchar(255) not null,
      created_at timestamp not null default now()
    );
    create table if not exists sessions (
      id varchar(64) primary key,
      user_id integer not null references users(id) on delete cascade,
      expires_at timestamp not null
    );
    create table if not exists requests (
      id serial primary key,
      reference varchar(20) not null unique,
      user_id integer not null references users(id) on delete cascade,
      service varchar(60),
      origin varchar(160),
      destination varchar(160),
      cargo text,
      weight_kg varchar(40),
      preferred_date varchar(40),
      status varchar(30) not null default 'submitted',
      quoted_amount varchar(40),
      created_at timestamp not null default now(),
      updated_at timestamp not null default now()
    );
    create table if not exists request_updates (
      id serial primary key,
      request_id integer not null references requests(id) on delete cascade,
      status varchar(30) not null,
      note text,
      created_at timestamp not null default now()
    );
  `)
}

async function readFileDb(): Promise<FileShape> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(raw) as FileShape
  } catch {
    return { seq: { users: 0, requests: 0, updates: 0 }, users: [], sessions: [], requests: [], updates: [] }
  }
}

async function writeFileDb(db: FileShape) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf8")
}

const now = () => new Date().toISOString()

/* ------------------------------- users ---------------------------------- */

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const p = await tryPg()
  const key = email.toLowerCase()
  if (p) {
    const r = await p.query<UserRow>("select * from users where lower(email) = $1", [key])
    return r.rows[0] ?? null
  }
  const db = await readFileDb()
  return db.users.find((u) => u.email.toLowerCase() === key) ?? null
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const p = await tryPg()
  if (p) {
    const r = await p.query<UserRow>("select * from users where id = $1", [id])
    return r.rows[0] ?? null
  }
  const db = await readFileDb()
  return db.users.find((u) => u.id === id) ?? null
}

export async function createUser(input: {
  name: string
  email: string
  phone: string | null
  company: string | null
  passwordHash: string
}): Promise<UserRow> {
  const p = await tryPg()
  if (p) {
    const r = await p.query<UserRow>(
      `insert into users (name, email, phone, company, password_hash)
       values ($1,$2,$3,$4,$5) returning *`,
      [input.name, input.email.toLowerCase(), input.phone, input.company, input.passwordHash],
    )
    return r.rows[0]
  }
  const db = await readFileDb()
  const user: UserRow = {
    id: ++db.seq.users,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    company: input.company,
    password_hash: input.passwordHash,
    created_at: now(),
  }
  db.users.push(user)
  await writeFileDb(db)
  return user
}

/* ------------------------------ sessions -------------------------------- */

export async function createSession(id: string, userId: number, expiresAt: Date) {
  const p = await tryPg()
  if (p) {
    await p.query("insert into sessions (id, user_id, expires_at) values ($1,$2,$3)", [
      id,
      userId,
      expiresAt,
    ])
    return
  }
  const db = await readFileDb()
  db.sessions.push({ id, user_id: userId, expires_at: expiresAt.toISOString() })
  await writeFileDb(db)
}

export async function getSessionUser(id: string): Promise<UserRow | null> {
  const p = await tryPg()
  if (p) {
    const r = await p.query<UserRow>(
      `select u.* from sessions s join users u on u.id = s.user_id
       where s.id = $1 and s.expires_at > now()`,
      [id],
    )
    return r.rows[0] ?? null
  }
  const db = await readFileDb()
  const s = db.sessions.find((x) => x.id === id && new Date(x.expires_at) > new Date())
  if (!s) return null
  return db.users.find((u) => u.id === s.user_id) ?? null
}

export async function deleteSession(id: string) {
  const p = await tryPg()
  if (p) {
    await p.query("delete from sessions where id = $1", [id])
    return
  }
  const db = await readFileDb()
  db.sessions = db.sessions.filter((s) => s.id !== id)
  await writeFileDb(db)
}

/* ------------------------------ requests -------------------------------- */

export function makeReference() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `MTC-${new Date().getFullYear()}-${n}`
}

export async function createRequest(input: {
  userId: number
  service: string | null
  origin: string | null
  destination: string | null
  cargo: string | null
  weightKg: string | null
  preferredDate: string | null
}): Promise<RequestRow> {
  const reference = makeReference()
  const p = await tryPg()
  if (p) {
    const r = await p.query<RequestRow>(
      `insert into requests (reference, user_id, service, origin, destination, cargo, weight_kg, preferred_date)
       values ($1,$2,$3,$4,$5,$6,$7,$8) returning *`,
      [
        reference,
        input.userId,
        input.service,
        input.origin,
        input.destination,
        input.cargo,
        input.weightKg,
        input.preferredDate,
      ],
    )
    const row = r.rows[0]
    await p.query("insert into request_updates (request_id, status, note) values ($1,$2,$3)", [
      row.id,
      "submitted",
      "Request received. Our team will review it within 2 working hours.",
    ])
    return row
  }
  const db = await readFileDb()
  const row: RequestRow = {
    id: ++db.seq.requests,
    reference,
    user_id: input.userId,
    service: input.service,
    origin: input.origin,
    destination: input.destination,
    cargo: input.cargo,
    weight_kg: input.weightKg,
    preferred_date: input.preferredDate,
    status: "submitted",
    quoted_amount: null,
    created_at: now(),
    updated_at: now(),
  }
  db.requests.push(row)
  db.updates.push({
    id: ++db.seq.updates,
    request_id: row.id,
    status: "submitted",
    note: "Request received. Our team will review it within 2 working hours.",
    created_at: now(),
  })
  await writeFileDb(db)
  return row
}

export async function listRequests(userId: number): Promise<RequestRow[]> {
  const p = await tryPg()
  if (p) {
    const r = await p.query<RequestRow>(
      "select * from requests where user_id = $1 order by created_at desc",
      [userId],
    )
    return r.rows
  }
  const db = await readFileDb()
  return db.requests
    .filter((x) => x.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getRequest(reference: string, userId: number): Promise<RequestRow | null> {
  const p = await tryPg()
  if (p) {
    const r = await p.query<RequestRow>(
      "select * from requests where reference = $1 and user_id = $2",
      [reference, userId],
    )
    return r.rows[0] ?? null
  }
  const db = await readFileDb()
  return db.requests.find((x) => x.reference === reference && x.user_id === userId) ?? null
}

export async function listUpdates(requestId: number): Promise<UpdateRow[]> {
  const p = await tryPg()
  if (p) {
    const r = await p.query<UpdateRow>(
      "select * from request_updates where request_id = $1 order by created_at asc",
      [requestId],
    )
    return r.rows
  }
  const db = await readFileDb()
  return db.updates
    .filter((u) => u.request_id === requestId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export async function cancelRequest(reference: string, userId: number) {
  const p = await tryPg()
  if (p) {
    const r = await p.query<RequestRow>(
      "update requests set status='cancelled', updated_at=now() where reference=$1 and user_id=$2 returning *",
      [reference, userId],
    )
    if (r.rows[0]) {
      await p.query("insert into request_updates (request_id, status, note) values ($1,$2,$3)", [
        r.rows[0].id,
        "cancelled",
        "Cancelled by the customer.",
      ])
    }
    return
  }
  const db = await readFileDb()
  const row = db.requests.find((x) => x.reference === reference && x.user_id === userId)
  if (!row) return
  row.status = "cancelled"
  row.updated_at = now()
  db.updates.push({
    id: ++db.seq.updates,
    request_id: row.id,
    status: "cancelled",
    note: "Cancelled by the customer.",
    created_at: now(),
  })
  await writeFileDb(db)
}

export async function storageMode() {
  return (await tryPg()) ? "postgres" : "local file (.data/portal.json)"
}
