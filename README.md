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

## Contact form

The form posts straight from the browser to [Formspree](https://formspree.io) — there is no API route and no server secret.

**No setup is required.** The live endpoint is checked into `components/Contact.tsx` as `FALLBACK_ENDPOINT`, so a fresh clone and every deploy reach the real form with nothing configured. The endpoint id is **not a secret**: on an ordinary Formspree site it sits in the form's `action` attribute, so it ships to the browser either way. That is why it carries the `NEXT_PUBLIC_` prefix.

`NEXT_PUBLIC_FORMSPREE_ENDPOINT` overrides the default when it is set — useful for pointing a preview build at a throwaway form. Both are inlined at build time, so changing either needs a rebuild, not just a restart.

Formspree emails a one-time confirmation link the first time a **new** form receives a submission. Until that link is clicked the site will say the message sent while nothing is delivered, so submit once and confirm after creating any new form.

Spam handling is Formspree's: every form gets reCAPTCHA, and the form ships a `_gotcha` honeypot field (off-screen, `tabIndex={-1}`) that Formspree silently discards when a bot fills it in.

## Deploying

With the form on Formspree there is no server code left, so `next build` emits a fully static site and it can go on any static host — [Vercel](https://vercel.com/new), Netlify, Cloudflare Pages, GitHub Pages.

No environment variables are needed. Push the repo, point the host at it, and the contact form works on the first deploy.

## Editing content

Everything factual lives in `lib/data.ts` — profile, focus areas, projects, timeline, skills. Update that one file to keep the site current.
