# Haven rental site

Search homes, apply, schedule a tour, and pay an application fee. Home maintainers can apply to work on listed properties.

## Run locally

```bash
npm install
cp .env.example .env.local
```

Put your admin email, password, and a long random `ADMIN_SECRET` in `.env.local`, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Host on Vercel

Admin login is not stored in git. It reads environment variables, so it works on Vercel after you set them.

1. Import this GitHub repo in [Vercel](https://vercel.com/new)
2. In the project: **Settings → Environment Variables**, add:

| Name | Value |
| --- | --- |
| `ADMIN_EMAIL` | the owner login email |
| `ADMIN_PASSWORD` | a strong password |
| `ADMIN_SECRET` | a long random string (not the password) |

3. Deploy. Sign in at `/admin/login` with that email and password.

Use the same three values as `.env.local` if you want local and Vercel to share one login.

## Where the owner sees submitted data

All renter and maintainer forms are stored on this app (local `data/db.json` plus uploaded IDs).

1. Scroll to the tiny **admin** link in the site footer
2. Sign in at `/admin/login` with the owner email and password
3. Open **Renter applications** or **Home maintainers** to read every field, ID photo, tour date, trade category, and payout account

## Public site

- Search homes from the landing page
- **Schedule a tour** — pick a listing, apply, choose a date, pay, get a receipt
- **Home maintainer** — apply with trade category (plumber, cleaner, carpenter, and more), ID, SSN, work days, pay per 2× week, and payout account. Maintainers must apply before **Get code and view now**
