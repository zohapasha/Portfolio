<<<<<<< HEAD
# Zoha Pasha — Portfolio

A personal portfolio site that opens with a WebGL sequence — a derelict academic hall at night, one lit window, in through the doors and down the hall until the camera pushes into the laptop screen and the site resolves. After that the interface goes quiet: near-black, large type, one ember accent.

See `DESIGN.md` for the full design system and `PRODUCT.md` for product context.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Three Fiber / three.js · Framer Motion · Resend

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## The intro sequence

Lives in `components/intro/`. `IntroGate` decides whether it plays at all — it runs **once per session**, and is skipped entirely for visitors who prefer reduced motion or are on a viewport under 480px wide. There is always a visible "Skip intro" control. The site is complete without it.

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

## Contact form setup (required for the form to send mail)

The form posts to `app/api/contact/route.ts`, which sends via [Resend](https://resend.com) to `zohapasha16@gmail.com`. Without an API key it fails visibly with a clear error rather than pretending to send.

1. Create a free Resend account (100 emails/day) and get an API key.
2. Copy `.env.local.example` to `.env.local` and set `RESEND_API_KEY`.
3. By default mail sends from Resend's shared sandbox address (`onboarding@resend.dev`), which only delivers to the address you signed up with — fine for testing, **not** for production.
4. For production, verify your own domain in Resend and set `RESEND_FROM_ADDRESS`.

## Deploying

Needs a host that runs Next.js API routes as serverless functions — [Vercel](https://vercel.com/new) is simplest and free for this. Set `RESEND_API_KEY` (and `RESEND_FROM_ADDRESS`) as environment variables in the hosting dashboard; they are never committed.

## Editing content

Everything factual lives in `lib/data.ts` — profile, research interests, projects, timeline, skills. Update that one file to keep the site current.
=======
# Portfolio
>>>>>>> 3772ac3e9937b65a2bc35c98a66af6514c58289e
