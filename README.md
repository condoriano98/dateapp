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

When someone confirms, the chosen day/time/activity is printed to the browser
**DevTools console** and saved to that browser's **localStorage**. Visit **`/admin`**
to see a list of those responses (with a Refresh and Clear button).

Note: localStorage is per-browser, so `/admin` shows confirmations made on the same
browser/device — it does not collect submissions from other people's phones (that would
need a backend/database).

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new). Next.js is
auto-detected — no configuration needed. Every push to `main` then auto-deploys.
