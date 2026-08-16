# Zoha Pasha — Portfolio

A personal portfolio site that opens with a WebGL sequence — a derelict academic hall at night, one lit window, in through the doors and down the hall until the camera pushes into the laptop screen and the site resolves. After that the interface goes quiet: night-blue, large type, moonlight and lamplight as the two accents.

See `DESIGN.md` for the full design system and `PRODUCT.md` for product context.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Three Fiber / three.js · Framer Motion · Formspree

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## The intro sequence

Lives in `components/intro/`. `IntroGate` decides whether it plays at all — it runs **once per session**, and is skipped entirely for visitors who prefer reduced motion or are on a viewport under 480px wide. There is always a visible "Skip intro" control, and a "Replay intro" link in the footer. The site is complete without it.

To inspect a specific moment while working on it, append `?introT=` with a value from 0 to 1 — this freezes the camera at that point in the timeline:

```
http://localhost:3000/?introT=0.45
```

### The laptop screen

The laptop in the intro shows a real capture of the site's own hero, stored at `public/intro/site-screen.png`. If you change the hero, regenerate it or the intro will show the old one:

```bash
npm run dev          # in one terminal
node capture-screen.mjs
```

### The narration

The four lines live in `LINES` at the top of `components/intro/Intro.tsx`. Timing is derived from the copy, so editing the text re-times the typing pass automatically — no need to re-tune it against the camera.

## Contact form setup (required for the form to deliver)

The form posts straight from the browser to [Formspree](https://formspree.io) — there is no API route and no server secret. Until an endpoint is set it fails visibly with a clear message rather than pretending to send.

1. Sign up at [formspree.io](https://formspree.io), then **+ Add New → New Form**.
2. Set the form's recipient to `zohapasha16@gmail.com` and copy the endpoint — it looks like `https://formspree.io/f/xyzabcde`.
3. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` to that full URL.
4. Restart the dev server, then submit the form once. Formspree emails you a one-time confirmation link the first time a new form receives a submission — click it, or nothing will be delivered afterwards.

The endpoint id is **not a secret**: on an ordinary Formspree site it sits in the form's `action` attribute. That is why it carries the `NEXT_PUBLIC_` prefix and is safe to commit to a private repo or set in a hosting dashboard.

Spam handling is Formspree's: every form gets reCAPTCHA, and the form ships a `_gotcha` honeypot field (off-screen, `tabIndex={-1}`) that Formspree silently discards when a bot fills it in.

## Deploying

With the form on Formspree there is no server code left, so `next build` emits a fully static site and it can go on any static host — [Vercel](https://vercel.com/new), Netlify, Cloudflare Pages, GitHub Pages.

Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in the hosting dashboard's environment variables. It is inlined at build time, so a change to it needs a rebuild, not just a restart.

## Editing content

Everything factual lives in `lib/data.ts` — profile, focus areas, projects, timeline, skills. Update that one file to keep the site current.
