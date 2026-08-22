# Haven rental site

Search homes, apply, schedule a tour, and pay an application fee. Home maintainers can apply to work on listed properties.

This is one Next.js app. Listings are stored in a shared Postgres database when `DATABASE_URL` is set, so a house you publish in admin on this Mac also appears on Vercel. If that URL is missing, the public site still loads from seed data and does not crash.

## Run locally (admin lives here)

```bash
npm install
cp .env.example .env.local
```

Put your admin email, password, a long random `ADMIN_SECRET`, and the same `DATABASE_URL` used on Vercel in `.env.local`, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Host on Vercel

1. Import this GitHub repo in [Vercel](https://vercel.com/new)
2. In **Settings → Environment Variables**, add `DATABASE_URL` (same value as `.env.local`)
3. Deploy
4. Turn off **Deployment Protection** if visitors see a Vercel login screen
5. Open the **Production** URL (not a preview URL with a random code in the middle)

The owner desk does **not** run on Vercel. Publish homes from this Mac; the live site reads the same database.

If you forked the repo, click **Sync fork** on GitHub, then **Redeploy** in Vercel.

## Where the owner sees submitted data

1. Run `npm run dev`
2. Open the tiny **admin** link in the footer (local site only)
3. Sign in at `/admin/login`
4. Open **Renter applications** or **Home maintainers**

## Public site

- Search homes from the landing page
- **Schedule a tour** — pick a listing, apply, choose a date, pay, get a receipt
- **Home maintainer** — apply with trade category (plumber, cleaner, carpenter, and more), ID, SSN, work days, pay per 2× week, and payout account. Maintainers must apply before **Get code and view now**
