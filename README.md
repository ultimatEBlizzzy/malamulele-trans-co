# Malamulele Trans Co

Transport & logistics website with a customer portal, built with Next.js 16, React 19,
Tailwind CSS 4 and Postgres (Drizzle).

## How to run it

You need **Node.js 20 or newer**. Check with `node -v`.

```bash
# 1. get the code
git clone https://github.com/ultimatEBlizzzy/malamulele-trans-co.git
cd malamulele-trans-co
git checkout arena/01a0715a-malamulele-trans-co

# 2. install pnpm (skip if you already have it)
npm install -g pnpm

# 3. install dependencies
pnpm install

# 4. start the dev server
pnpm dev
```

Now open **http://localhost:3000**.

### Already cloned it before?

```bash
cd malamulele-trans-co
git fetch origin
git checkout arena/01a0715a-malamulele-trans-co
git pull
pnpm install
pnpm dev
```

### Other commands

| Command        | What it does                                  |
| -------------- | --------------------------------------------- |
| `pnpm dev`     | Run the site locally with hot reload           |
| `pnpm build`   | Build for production                           |
| `pnpm start`   | Run the production build (after `pnpm build`)  |
| `pnpm db:push` | Create/update the database tables in Postgres  |

## Try the portal

1. Click **Register** in the top-right of the site header
2. Enter a name, an email, and a password of **at least 8 characters** (typed twice)
3. You land in your portal — click **New request**
4. Choose a service, a collection point and a delivery point, then submit
5. You get a reference like `MTC-2026-1234` and a tracking page with a progress
   tracker and activity timeline
6. **Dashboard** lists all your requests; **Sign out** / **Sign in** to come back

## Database

Create a `.env` file in the project root:

```
DATABASE_URL=postgres://user:password@host:5432/dbname
ADMIN_PASSWORD=choose-something-strong
```

**The app runs fine without a database.** If `DATABASE_URL` is missing or the
database can't be reached, accounts and requests are saved to a local
`.data/portal.json` file instead (it's gitignored). As soon as Postgres is
reachable the app switches to it automatically and creates its own tables —
no code change needed. You can also run `pnpm db:push` to create them up front.

## Pages

| Route                          | What it is                                     |
| ------------------------------ | ---------------------------------------------- |
| `/`                            | Homepage — hero, services, fleet, how it works  |
| `/services`                    | The six services offered                        |
| `/fleet`                       | Fleet table                                     |
| `/about`                       | Company background                              |
| `/contact`                     | Phone, WhatsApp, email, address                 |
| `/register`                    | Create a customer account                       |
| `/login`                       | Customer sign in                                |
| `/portal`                      | Dashboard — all your requests                   |
| `/portal/new`                  | Log a new transport request                     |
| `/portal/requests/[reference]` | Track one request: progress + timeline          |

## Editing the content

All the copy, contact details, services and fleet data live in one file:
**`lib/site.ts`**. Change the phone number, address, hours, fleet list and
service descriptions there and they update everywhere on the site.

The request statuses (Submitted → Under review → Quote sent → Booking confirmed
→ In transit → Delivered) are defined in **`lib/status.ts`**.

## Project structure

```
app/            pages and server actions
components/     shared UI (header, footer, forms, badges)
lib/site.ts     all site content — edit this first
lib/status.ts   request status flow
lib/auth.ts     password hashing and sessions
lib/store.ts    data access (Postgres, with local-file fallback)
lib/db/schema.ts  Drizzle table definitions
```
