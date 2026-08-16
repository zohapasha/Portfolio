# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally: (1) recruiters and hiring managers evaluating Zoha for AI / ML / software engineering internship or new-grad roles, and (2) graduate program admissions reviewers evaluating research fit. Both are short-attention-span evaluators skimming many candidates; both need to quickly see evidence of real, hands-on work rather than claims.

Her career direction is deliberately undecided: AI engineering, ML engineering, and graduate study are all live options. The site must therefore read as broadly capable across AI/ML rather than pre-committed to one narrow specialism — copy should not imply she is set on a single sub-field.

## Product Purpose

A personal portfolio site for Zoha Pasha that establishes credibility fast, showcases her actual projects and research, and gives visitors a direct way to reach her (contact form + LinkedIn + GitHub). Success = a visitor remembers her, understands what she's capable of, and either reaches out or clicks through to GitHub/LinkedIn/resume.

## Positioning

Not a generic "full-stack student" portfolio. Her differentiator is the combination of (a) genuine ML/AI depth — she doesn't just call APIs, she built a token-level LLM hallucination/confidence debugger with real calibration metrics (AUROC, ECE) and a CNN super-resolution research pipeline from scratch — with (b) hands-on breadth across game dev (Unreal Engine 5, AI-driven NPCs), full-stack web, and systems-level languages (C++, C#, Assembly). The throughline is an investigator's instinct: she builds tools to find out what's really happening inside a system (why did the model hallucinate, why did the NPC make that choice), rather than trusting the surface behaviour. Computer vision is where her final-year work sits; language models and deep learning are the other two areas she wants to keep building in. State these as areas of work, never as a declared specialism.

## Operating Context

Single-visitor browsing session, arrived via a resume link, LinkedIn profile, or GitHub. Viewed on both desktop and mobile. No login, no CMS, no multi-user flows — a static informational site with one functional feature (contact form submission).

## Capabilities and Constraints

- Content (education, research, projects, experience, certifications, skills) is static and sourced from her CV (`c:\Users\Zoha\Downloads\zoha_cv.pdf`) — do not fabricate projects, metrics, employers, or dates beyond what the CV states.
- Contact form must deliver real email to zohapasha16@gmail.com via a Next.js API route calling Resend. Requires a `RESEND_API_KEY` env var the user provisions before the form works in production; until then the route should fail gracefully with a clear error, not silently pretend to succeed.
- No live demo URLs or screenshots were supplied for the projects — link out to GitHub (github.com/zohapasha) rather than inventing hosted demo links or repo-specific URLs that weren't confirmed.
- Phone number appears on the CV but is not to be published on the public site (privacy); email is the public contact channel, primarily via the on-site form rather than a raw mailto address.
- Deploy target is expected to be Vercel or an equivalent platform that supports Next.js serverless/edge API routes (required for the contact form to function).

## Brand Commitments

- Name: Zoha Pasha.
- LinkedIn: linkedin.com/in/zoha-pasha-a35022276
- GitHub: github.com/zohapasha
- No headshot/photo — text- and graphic-only treatment, confirmed by the user.
- Tone the user explicitly requested: light color palette (white/black + one accent color), Apple-inspired minimalism, but "cool, unique, edgy" — not safe or generic.

## Evidence on Hand

From her CV: FAST-NUCES Lahore CS student (3.86 CGPA, Dean's List x4, Rector's List x2); Sentinel-2 super-resolution research (CNN, channel attention, DSen2-based); LLM Reasoning Debugger (FastAPI + terminal-style frontend, token-level confidence/entropy/attention/hallucination risk, 28-question benchmark, AUROC/ECE calibration analysis); AI Murder Mystery Game (Unreal Engine 5, Blueprints, C++, Behaviour Trees, LLM-integrated dialogue); Airline Management System (Next.js, Tailwind, SQL Server); FAST Learning System (WPF, C#, Supabase, AI chatbot); Social Networking System (C++, Qt); Machine Learning Specialization (DeepLearning.AI/Coursera); Frontend Development Intern at OSOL Technologies; Developer Intern at Clear Wave Information Technologies (CWIT). Full skills list captured in CV. No testimonials, press, or case studies exist — do not invent any.

## Product Principles

1. Every claim on the site must trace back to the CV or a fact the user confirmed directly — no invented metrics, employers, or demo links.
2. Depth over breadth-signaling: the site should make her actual technical depth (calibration analysis, channel-attention architecture, behaviour-tree AI) legible to a skimming reviewer, not bury it under generic buzzwords.
3. The contact form is a real feature, not a placeholder — it must actually deliver mail or fail visibly, never fail silently.
4. Respect the privacy boundary the user drew: phone number stays off the public site.
5. Personality-forward but credible: "edgy and unique" serves the two evaluator audiences, it doesn't override their need to quickly verify competence.
