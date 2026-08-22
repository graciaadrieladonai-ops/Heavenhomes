# Haven rental site

Search homes, apply, schedule a tour, and pay an application fee. Home maintainers can apply to work on listed properties.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Where the owner sees submitted data

All renter and maintainer forms are stored on this app (local `data/db.json` plus uploaded IDs). No paid backend is required.

1. Scroll to the tiny **admin** link in the site footer
2. Sign in at `/admin/login` with the owner email and password in `.env.local`
3. Open **Renter applications** or **Home maintainers** to read every field, ID photo, tour date, and payout account

## Public site

- Search homes from the landing page
- **Schedule a tour** — pick a listing, apply, choose a date, pay, get a receipt
- **Home maintainer** — separate application with ID, SSN, work days, pay per 2× week, and payout account
