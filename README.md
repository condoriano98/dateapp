# A Very Important Question 💕

A playful single-page "will you go on a date with me?" site — Yes celebrates with
confetti, and the No button runs away so it can never be clicked. Built with
Next.js + Tailwind CSS, deploys to Vercel with zero config.

Inspired by `date-quiz--dont-worry-it-is-pass-fail.com`.

## Customize it

All the copy lives in one place: the `CONFIG` object at the top of
[`app/page.js`](app/page.js). Edit the names and text, then redeploy:

```js
const CONFIG = {
  yourName: "Your Name",
  theirName: "Their Name",
  subheading: "A very important question",
  question: "Will you go on a date with me?",
  yesLabel: "Yes 💕",
  noLabel: "No 😢",
  successMessage: "Yay! Can't wait, {theirName}! 💕",
  footer: "yes I made this website · yes I used AI · ...",
};
```

`{theirName}` in `successMessage` is replaced automatically. Set any field to `""`
to hide it.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

Push to GitHub and import the repo at [vercel.com](https://vercel.com), or run
`vercel --prod`. Next.js is auto-detected — no configuration needed.
