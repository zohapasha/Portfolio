---
name: Zoha Pasha
description: A cinematic WebGL entry into a derelict academic hall, resolving into a quiet near-black portfolio carried by large type and one ember accent.
colors:
  night-deep: "#070a12"
  night: "#0b0e1a"
  slate: "#141a2b"
  slate-2: "#1b2236"
  parchment: "#efeae0"
  mist: "#a2abc2"
  line: "#232b40"
  moon: "#93b4e8"
  lamp: "#e9b172"
  ink: "#d0604a"
  dusk: "#a894d4"
typography:
  display-xl:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "clamp(3rem, 11vw, 9.5rem)"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  display-lg:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  display-md:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3.4vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  display-ghost:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "clamp(4rem, 8vw, 7rem)"
    fontWeight: 600
    lineHeight: 0.8
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.18em"
rounded:
  none: "0px"
  pill: "999px"
spacing:
  gutter: "1.5rem"
  gutter-lg: "2.5rem"
  section-y: "6rem"
  section-y-lg: "9rem"
components:
  button-primary:
    backgroundColor: "{colors.void}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.void}"
  input-underline:
    backgroundColor: "{colors.void}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "12px 0"
---

# Design System: Zoha Pasha

## Overview

**Creative North Star: "The Lit Window"**

The site opens as a film. A derelict classical academic hall stands at night under a moon, one window still burning ember-orange. The camera crosses the grounds, passes through the portico, moves down a moonlit corridor, turns into a room, and finds a girl at a laptop — then pushes into the screen until its glow becomes the page. The building is the graduate program she has not been admitted to yet; the lit window is the work she is doing anyway. Every color on the resting site is drawn out of that sequence: the near-black of the grounds, the cream of the moonlight, the ember of the screen.

After that, the interface deliberately gets quiet. The scroll is generous, near-black, typographic, and almost chromeless — closer to a printed monograph than to a product page. Nothing bounces, nothing parallaxes, nothing competes with the work being described. There is exactly one entrance gesture (a short rise from below) used on every block, so the page reads as a single hand.

Rejected during the build: a numbered "research dossier" system in off-white and signal red, and the accompanying interactive quiz — both replaced wholesale at the user's direction in favour of the cinematic entry plus a simpler resting language.

**Key Characteristics:**
- Dark by scene, not by fashion: the palette is the night the intro takes place in.
- One accent, ember orange, always sourced from a light in the story.
- Bricolage Grotesque set very large and very tight; whitespace does the structuring, not rules or boxes.
- No content cards. Sections separate with a single hairline and a great deal of air; the only bordered containers in the system are the three diagram figure panels, which are frames around artwork rather than wrappers around text.
- Square corners throughout; the only radii are a pill on the scrollbar thumb.
- The three domain diagrams are drawn mechanisms, not decoration — a convolution kernel sweeping a feature map, attention arcs over a token stream, activation crossing a layered network.

## Colors

The palette is lifted straight out of the intro's lighting, so the site and the film are one world rather than two products. Every hue exists somewhere in that scene: the night sky is the ground, the two light sources are the two accents, the paper pinned above her desk is the type colour, and the red pen that circles her deadline is the alert.

### Primary
- **Moon** (`#93b4e8`): the cool lead accent, taken from the moonlight through the hall's broken roof. Section markers, links on hover, form focus, the convolution diagram, the second metric. Contrast ≈9:1 on Night.
- **Lamp** (`#e9b172`): the warm answer, taken from the desk lamp that lights her. Years in the work list, the attention diagram, the primary button's hover, the hero's status dot. ≈10:1.

### Secondary
- **Dusk** (`#a894d4`): the band between night and horizon in the intro's sky. The About section, the network diagram, certification entries.
- **Ink** (`#d0604a`): the red pen circling `APPLICATION — DEC 15` on her wall. Used only where something is marked or has gone wrong: the contact section's accent and form errors. ≈4.9:1.

### Neutral
- **Night** (`#0b0e1a`) and **Night Deep** (`#070a12`): the ground, and the vignette that closes the page's edges. Blue-black, not neutral black — it is the intro's sky.
- **Slate** (`#141a2b`) / **Slate 2** (`#1b2236`): raised planes; the diagram panels sit on Slate at 70% over the ambient wash.
- **Parchment** (`#efeae0`): all primary type. The colour of the paper on her wall.
- **Mist** (`#a2abc2`): secondary type, tinted cool so it belongs to the moonlight rather than being grey. ≈8.5:1.
- **Line** (`#232b40`): every rule, border and hairline. One weight, 1px.

### Named Rules
**The Sourced Light Rule.** Every accent is a light that exists in the intro. Nothing is coloured to decorate; a hue appears because something in the room is emitting it. Adding a colour means first deciding what in that scene it comes from.

**The Two-Temperature Rule.** Cool leads and warm answers. Moon carries structure and state; Lamp carries warmth and emphasis. A section picks one and lets the other appear only as a counterweight.

## Typography

**Display Font:** Bricolage Grotesque (with Archivo, system-ui fallback)
**Body / UI Font:** Archivo (with system-ui fallback)
**Label / Data Font:** Geist Mono (with ui-monospace fallback)

**Character:** Bricolage Grotesque carries every heading — a grotesque with enough irregularity in its curves and terminals to feel authored rather than defaulted, set tight (down to -0.035em) and very large so the page has a voice before a single word is read. Archivo handles body copy at a comfortable 1.6 line-height. Geist Mono appears only on true labels and data: section markers, years, stack lists, form field labels. It is never used to make prose look technical.

### Hierarchy
- **Display XL** (600, `clamp(3rem, 11vw, 9.5rem)`, 0.88): the name in the hero. Used once.
- **Display LG** (500, `clamp(2.25rem, 6vw, 4.5rem)`, 0.95): the contact section's statement, and any full-width declarative line.
- **Display MD** (500, `clamp(1.6rem, 3.4vw, 2.5rem)`, 1.05): focus titles, the featured project name, the opening paragraph of About.
- **Display Ghost** (600, `clamp(4rem, 8vw, 7rem)`, outlined in Line, transparent fill): the oversized section numeral in each rail. Decorative structure, never content — it is `aria-hidden`, and the same number is announced in readable size beside it.
- **Body** (400, 1.125rem, 1.6): all prose. Constrained to 62ch via `.measure`.
- **UI** (400, 0.875rem, 1.4): navigation links and other interface text that is neither prose nor a data label.
- **Label** (400, 0.75rem, +0.18em, uppercase): section markers, years, kinds, form labels, stack lists.

### Named Rules
**The Two-Voice Rule.** Prose is Archivo, structure and data are Geist Mono, and headings are Bricolage. A heading never renders in mono; a stack list or a year never renders in the body face.

## Layout

A single column with page gutters (`1.5rem` mobile, `2.5rem` from `md`) rather than a centered max-width container, so the page reads full-bleed and the type can run large. Inside sections, a 12-column grid places content asymmetrically: the hero's tagline sits in columns 7–12 under a name that starts at column 1; focus rows alternate the diagram between the left and right thirds; work rows put year and kind in columns 1–3 against the description in 4–12.

Section rhythm is `py-24` on mobile and `py-36` from `md`, with a single `border-t border-line` marking each boundary — the only structural rule in the system. Prose is capped at 62ch regardless of column width.

Navigation is a fixed top bar that is transparent at rest and gains a `bg-void/85` blur plus a bottom hairline after 40px of scroll. It carries the name and four anchors at all sizes; there is no hamburger, because four short labels fit a 390px viewport.

## Elevation & Depth

Flat. There is no `box-shadow` anywhere in the resting site. Grouping is done with hairlines and space alone, and the only depth in the product is literal — the WebGL scene in the intro, which has real geometry and real lights. The single blur in the system (`backdrop-blur` on the scrolled nav) is functional legibility, not atmosphere.

### Named Rules
**The Flat-Except-The-Film Rule.** Depth belongs to the intro. Once the page resolves, surfaces are flat and separation is hairlines and air.

## Shapes

Square corners everywhere — `border-radius: 0` on inputs, buttons, and every container. The exceptions are functional and tiny: the scrollbar thumb (pill), the small square section-marker dot, and the circular nodes inside the network diagram. Borders are always 1px in `Line`; the system has no heavier or coloured border weight, and no one-sided accent borders.

## Components

### Buttons
- **Shape:** square, 1px `Line` or `Cream` border, transparent fill at rest.
- **Primary:** `border-cream`, mono uppercase label at +0.14em, generous padding (24px horizontal).
- **Hover:** full invert to `Cream` background with `Void` text. No lift, no shadow, no scale.
- **Icons:** direction-carrying buttons pair with a hand-drawn SVG from `components/icons.tsx` (1.75px stroke, 24-unit grid). Never a Unicode arrow.

### Inputs
- **Style:** no box — a single `border-b` hairline in `Line`, transparent background, 1.125rem body type.
- **Focus:** underline shifts to `Ember`. A themed `:focus-visible` ring exists globally for keyboard users on non-text controls.
- **Placeholder:** explicitly `Cream Dim`, never a browser default.
- **Error:** a mono `Ember` line beneath the field, with `role="alert"`.

### Navigation
Transparent at rest, `bg-void/85` + blur + hairline once scrolled. Links are `Cream Dim`, going `Cream` on hover. The name is the left-most item and links to `#top`.

### Domain Diagrams (signature component)
Three authored SVGs in `components/Visuals.tsx`, one per research interest, each animating the mechanism it names: a 3×3 kernel sweeping an 8×8 feature map; weighted attention arcs rising over a token row; activation pulsing forward through a four-layer network. All three use a deterministic, rounded pseudo-random source so server and client markup match exactly, and all three collapse to a static state under `prefers-reduced-motion`.

### Figure Panel
The only bordered container in the system: `border-line` on `Surface`, square corners, 8–12 units of padding, wrapping one of the three domain diagrams. It exists so the artwork reads as a plate rather than as page texture. Paired with its text across a 12-column grid with an explicit `row-start`, because auto-placement will not backtrack when the alternating rows put the panel later in the column order but earlier in the DOM.

### The Intro Sequence (signature component)
A React Three Fiber scene in `components/intro/`, gated by `IntroGate` so it plays at most once per session, never under reduced-motion, and never below 480px. A `?introT=<0..1>` query parameter freezes the sequence at any point for visual verification.

The WebGL bundle is a few hundred KB, so `IntroGate` renders a **black loading fallback** while it arrives. Without one, a visitor on a cold cache sees the finished site first and then has the intro slam over the top of it.

It is **one continuous take** — no cuts. The camera follows a centripetal Catmull-Rom spline through twenty-one control points, from a wide on the building, through the portico, down the hall and around into the room, ending inside the laptop screen. The study is placed against the room's left wall so the ending is not visible through the front door on approach, and the spline is verified clear of the facade, hall walls and doorways before shipping.

Timing is separate from geometry. A **single velocity profile** — eased up from rest over the first tenth, then `0.88·(1−t)⁴ + 0.12` — drives distance travelled along the path. Three things about it are load-bearing, each found by measuring rather than by eye:

- **It never reaches zero mid-move.** An earlier version keyed time to a list of anchors and eased between them, which drove velocity to zero at every anchor: the camera stopped eight times, and that stop-start is what read as cut-up rather than as one shot.
- **The floor (`+ 0.12`) matters as much as the exponent.** Decaying to a true zero made the last second of the push into the screen crawl to a near-stall and then end, which read as sticking. Holding ~17% of peak speed all the way through means the camera is still gliding when it arrives.
- **The decay buys the interior its time.** The approach is most of the path's length, so a constant speed reaches the desk with a second to spare. Frame-to-frame speed never changes by more than ~3% of peak, which is what keeps it from reading as jittery.

The arc-length table is sampled at 2400 points. At 600 the final approach — under a unit of travel — stepped through only a handful of samples and visibly juddered.

The narration is **one unbroken typing pass**, not four separate captions. Each line begins the instant the previous has finished and taken a ~450ms breath, so a caret is always moving and it reads as someone typing to you in real time rather than as subtitles appearing and clearing. The rate (48ms per character) is chosen so the whole pass — 194 characters across four sentences — finishes just before the camera reaches the screen.

Because the schedule is derived from the copy rather than hand-placed, the lines then fall onto the framings they describe on their own: the greeting on the wide house, the welcome as the door is reached, the desk line across the room, and the last one closing on the laptop. Editing the copy re-times the pass automatically; it does not need re-tuning against the camera.

The take ends on a **match cut**, not a flash: the laptop panel takes the viewport's own aspect ratio and the camera parks at exactly the distance where it covers the frame, so the capture of the hero lines up with the real hero underneath and the intro simply cross-fades away. The panel's aspect is dynamic because a fixed one either leaves bezel showing or has to be over-scaled — and over-scaling cropped straight through the "Zoha" in the headline. The capture is fitted as `cover` through the map's repeat/offset rather than by stretching the plane, so the page keeps its proportions.

The laptop shows the **actual site**: `public/intro/site-screen.png` is a real capture of the hero, rendered unlit (`meshBasicMaterial`, `toneMapped={false}`) so the page keeps its own values instead of being relit by the room. Regenerate it with `node capture-screen.mjs` whenever the hero changes.

Because that panel is near-black it cannot plausibly light a warm room, so the warmth was given a physical source: a **desk lamp** at the back-left of the desk, aimed across so it side-lights her and separates the silhouette from the screen behind it. The panel contributes only a small cool spill, which is what a real monitor does in a dark room.

Surfaces are **procedurally textured** (`textures.ts`): seeded value noise painted onto canvases at load, giving albedo, roughness and normal maps for plaster, stone and floorboards. Flat solid colour on a clean box is the single clearest tell of untextured 3D — a real wall is never one value. There are no texture files to download and nothing that can 404 mid-sequence. Two things had to be tuned hard: the noise uses **integer bit-mixing rather than `sin`-based hashing**, because at several octaves per pixel the transcendental version cost millions of `Math.sin` calls and delayed the first frame by seconds; and normal strength is deliberately low (0.16 on interior walls), because grazing lamp light turns any real height detail into popcorn stucco. Surfaces are cached by kind, so each is painted once no matter how many meshes ask for it.

**Ambient occlusion** (N8AO) darkens the creases lighting alone leaves flat — wall to floor, under the desk, behind the props. It is what stops an interior reading as objects pasted onto a backdrop. The room also carries **skirting and a cased doorway**: a wall meeting a floor at a bare 90° edge is the other reliable tell, and the shadow line under trim is what gives a corner depth. Columns get bases and capitals; the facade gets a string course and plinth.

Realism otherwise comes from four things, in order of effect: **bloom** on the emissive lamp and window, which is what makes them read as light sources rather than bright paint; a **shadow-casting spot light** in the lamp, so the figure throws a shadow onto desk and wall; **chamfered props** (the `Prop` helper extrudes a rounded profile with a bevel — a hard 90° corner catches light as one flat band and is the clearest tell of untouched box geometry); and **window surrounds with mullions** on the facade, which give the building scale. A slow handheld sway keeps the moves from reading as matrix-perfect, and settles to nothing across the final shot so the match cut does not drift. Vignette and light grain finish it.

Depth of field was tried and removed: the four shots sit at wildly different subject distances — 37 units on the exterior, barely 2 at the desk — and a single focus plane blurred the subject in every one of them.

The room does the exposition, not the narration. `components/intro/posters.tsx` paints five canvas textures pinned to the wall above the desk — a graduate-admissions deadline sheet for Fall 2027 with the application date circled, a to-do list whose finished items are struck through and whose last unchecked line is "sleep", a calibration plot, and two sticky notes. Deadlines are generic milestones rather than named institutions, because which programs she is applying to is not a fact on record.

Narration is therefore four short first-person lines, one per shot, set as a film slate: bottom-left, mono, sentence case, capped at `max-w-3xl`, preceded by a short ember rule aligned to the cap line so it holds when a line wraps. Deliberately not a large centered title card, and deliberately understated — the posters already carry the sincerity, so the words can be dry.

Each line **types out** at ~27ms per character after a 240ms beat, with a hard-blinking ember caret (`steps(1)`, never a fade — a fading caret does not read as a typewriter). Audio is synthesised in `audio.ts`, not loaded: every keystroke is a short band-passed noise burst, with a lower thunk when a line lands and a near-silent room tone underneath. It is **opt-in via a Sound toggle and off by default**, because the intro autoplays and browsers correctly refuse audio that starts without a gesture — the AudioContext is constructed inside that click.

## Do's and Don'ts

### Do:
- **Do** keep Ember to the five sourced-light uses named in the Sourced Light Rule.
- **Do** cap prose at 62ch with `.measure`, whatever the column width.
- **Do** use the single `Reveal` entrance for every block, so the page has one motion vocabulary.
- **Do** round any computed value that reaches SSR markup — unrounded floats serialize differently on server and client and break hydration.
- **Do** keep `Cream Dim` at or above `#a9a59c` on `Void`; anything dimmer drops small text under the 4.5:1 contrast floor.
- **Do** state honestly what a project was — the Sentinel-2 entry is labelled a reproduction of published work, not original research, because it is.

### Don't:
- **Don't** add a shadow, gradient, or glass panel to the resting site; depth lives in the intro only.
- **Don't** wrap content in cards. Sections separate with a hairline and space; a bordered box is reserved for framing a diagram, never for grouping copy.
- **Don't** use a Unicode arrow, checkmark, or emoji where an icon belongs.
- **Don't** put a standalone mono label on its own line directly above a heading — that is a kicker. Markers sit inline with a dot, or beneath as a caption.
- **Don't** introduce a second accent colour, or round a corner outside the named exceptions.
- **Don't** let the intro become required: it must always be skippable, and the site must be complete without it.
