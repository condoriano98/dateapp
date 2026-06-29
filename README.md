# A Very Important Question 💕

A playful two-step "ask someone on a date" site, personalized for Farrah:

1. **The question** — "Will you spend the BOD meeting with me as ur assistant?" The **Yes**
   button advances; the **No** button runs away from the cursor and can never be clicked.
2. **Pick a time** — choose a day, a time (with snarky quips), and an activity
   (🍜 Mie · 🍦 Ice cream · 🥊 Tinju · 🏦 Rampok Bank · 🚨 buat keributan · ✨ Isi sendiri),
   then lock it in for a confetti confirmation.

Built with Next.js (App Router) + Tailwind CSS. Deploys to Vercel with zero config.

## Customize it

All copy lives in one place: the `CONFIG` object at the top of
[`app/page.js`](app/page.js) — names, the question, time options + quips, and the activity
list. Wrap a word in `*asterisks*` in any heading to render it in the accent color
(e.g. `"Pick a *time*."`). `{theirName}` is substituted automatically.

## Seeing responses

Visit **`/admin`** to see confirmations (with Refresh and Clear buttons). Each confirmation
is also printed to the browser **DevTools console**.

### Cross-device storage (Vercel KV / Upstash Redis)

To collect responses from **all devices** in one place, add a Redis store and set its env
vars — the app uses them automatically:

1. In the Vercel dashboard → your project → **Storage** → add **Upstash for Redis** (a.k.a.
   Vercel KV). Connect it to the project.
2. That adds the env vars automatically. The app reads either naming:
   `KV_REST_API_URL` + `KV_REST_API_TOKEN`, or `UPSTASH_REDIS_REST_URL` +
   `UPSTASH_REDIS_REST_TOKEN`.
3. Redeploy. `/admin` will now show submissions from every device.

If those env vars are absent, the app falls back to a per-browser **localStorage** log so it
still works locally. (Note: the `/api/responses` GET endpoint is open; the stored plans are
low-sensitivity, but don't put secrets in it.)

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new). Next.js is
auto-detected — no configuration needed. Every push to `main` then auto-deploys.
