# Haven rental site

Search homes, apply, schedule a tour, and pay an application fee. Home maintainers can apply to work on listed properties.

This is one Next.js app. There is no separate database and no second backend.

## Run locally (admin lives here)

```bash
npm install
cp .env.example .env.local
```

Put your admin email, password, and a long random `ADMIN_SECRET` in `.env.local`, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Listings, applications, and uploads are saved in `data/db.json` on this computer.

## Host on Vercel (public listings only)

Vercel cannot keep that JSON file. The hosted site shows the public homes. The owner desk does **not** run there — use this Mac instead.

1. Import this GitHub repo in [Vercel](https://vercel.com/new)
2. Deploy
3. Open the `*.vercel.app` URL to browse listings

You do not need `ADMIN_EMAIL` / `ADMIN_PASSWORD` on Vercel.

If you forked the repo, click **Sync fork** on GitHub, then **Redeploy** in Vercel. The first commit still crashes on Vercel because it tried to write `data/db.json`.

## Where the owner sees submitted data

On this Mac only:

1. Run `npm run dev`
2. Open the tiny **admin** link in the footer (local site only)
3. Sign in at `/admin/login`
4. Open **Renter applications** or **Home maintainers**

## Public site

- Search homes from the landing page
- **Schedule a tour** — pick a listing, apply, choose a date, pay, get a receipt
- **Home maintainer** — apply with trade category (plumber, cleaner, carpenter, and more), ID, SSN, work days, pay per 2× week, and payout account. Maintainers must apply before **Get code and view now**
