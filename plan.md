# Implementation plan

## Approach summary

- A static Astro site on one page, with one component per section in narrative order ([IA](docs/information-architecture.md)).
- Plain CSS: global tokens plus component-scoped styles. No CSS framework and no UI runtime.
- Content lives in typed data files. Open-now logic is a pure, tested function.
- Three tiny progressive-enhancement scripts: status, nav and form. Plus one reveal observer.
- Verify with Playwright (unit, e2e, axe) and screenshots at 390 / 768 / 1440, reviewed by eye.

## Files to create

| Path | Purpose |
|---|---|
| `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` | Project foundation |
| `eslint.config.js` | Lint: Astro + jsx-a11y recommended |
| `playwright.config.ts` | Runs tests against `astro preview` using system Chrome |
| `scripts/lint-tokens.mjs` | Fails if raw hex colours appear outside `tokens.css` (AC-12) |
| `scripts/shots.mjs` | Full-page and first-viewport screenshots at 320/390/768/1440 → `qa/shots/` |
| `scripts/subset-fonts.mjs` | Builds the Telugu and ₹ subset faces (D7) |
| `public/favicon.svg` | The ½ mark on an enamel ground |
| `src/data/site.ts` | Name, address, contact, hours (typed) |
| `src/data/menu.ts` | Board sections and items |
| `src/data/rules.ts` | House rules |
| `src/lib/hours.ts` | `getStatus`, `zonedParts`, `weekRows`, `summariseHours` in Asia/Kolkata (pure) |
| `src/lib/booking.ts` | Long-table validation, time options, WhatsApp message/URL (pure) |
| `src/styles/tokens.css` | Colour, type, space and motion tokens |
| `src/styles/global.css` | Reset, base type, `.container`, `.label`, buttons, focus, reveal utility |
| `src/layouts/Base.astro` | `<head>`, fonts, meta, skip link, `html.js` flag |
| `src/components/HalfMark.astro` | The ½ mark (SVG), sized by prop |
| `src/components/Header.astro` | Sticky bar, nav, mobile toggle (+ script) |
| `src/components/Sign.astro` | Hero: enamel sign + premise + status + CTAs |
| `src/components/OpenStatus.astro` | Status line: static fallback + live script (used twice) |
| `src/components/ByTwo.astro` | Ritual section with four figures |
| `src/components/figures/*.astro` | Fig 1–4 SVG drawings |
| `src/components/Board.astro` | Menu plate |
| `src/components/Rules.astro` | House rules plate |
| `src/components/Families.astro` | Two trades / two origins |
| `src/components/Visit.astro` | Address, hours table, floor plan, form |
| `src/components/FloorPlan.astro` | Plan-view SVG of the room |
| `src/components/LongTableForm.astro` | Booking request form (+ script) |
| `src/components/Footer.astro` | Footer |
| `src/pages/index.astro` | Composes the sections |
| `tests/hours.spec.ts` | AC-2 unit tests (no browser) |
| `tests/site.spec.ts` | AC-1, 3–11, 15–17, 20–21, 25 |
| `tests/a11y.spec.ts` | AC-18 axe at desktop + mobile |
| `tests/booking.spec.ts` | R9 / AC-10 booking rules (no browser) |
| `tests/build.spec.ts` | AC-23 JS budget, AC-24 font preloads (reads `dist/`) |

## Files to modify

| Path | Change |
|---|---|
| `README.md` | Replace the one-liner with a short intro + commands + doc map |

## Architecture

- **Data → components → page.** Components import from `src/data/`. Only `index.astro` composes sections. Sections don't import each other, except shared atoms: `HalfMark`, `OpenStatus`.
- **Logic:** `src/lib/hours.ts` is the only place that knows about time. It is consumed at build time (static hours table) and at runtime (status script + today highlight). It has no DOM access, so it is unit-testable.
- **Scripts:** each interactive component owns a `<script>` (bundled by Astro). Scripts find their elements via `data-*` hooks, never via styling classes.
- **Styling:** tokens are global custom properties. Component CSS is scoped and uses only tokens. Utilities in `global.css` are limited to `.container`, `.label`, `.btn`, `.visually-hidden` and `.reveal`.

## Implementation sequence

> Status 2026-10-06: T1–T13 complete. See `docs/evaluation.md` for evidence and the open backlog.

Each task ends with its verification passing. [P] = can run in parallel with the previous task.

**T1 — Foundation**
- Goal: Astro project builds and serves an empty page.
- Files: config files, `Base.astro`, `index.astro`.
- Depends on: none.
- Verify: `npm run build` exits 0; `npm run check` 0 errors.
- AC: build output exists at `dist/index.html`.

**T2 — Tokens, fonts, global CSS**
- Goal: the type and colour system renders.
- Files: `tokens.css`, `global.css`, `Base.astro`.
- Depends on: T1.
- Verify: `lint:tokens` passes; screenshot of a type specimen looks right.
- AC: V1, V4, AC-24.

**T3 — Data + hours logic + unit tests** [P]
- Goal: content and open-now logic exist and are tested.
- Files: `src/data/*`, `src/lib/hours.ts`, `tests/hours.spec.ts`.
- Depends on: T1.
- Verify: `npx playwright test tests/hours.spec.ts` is green.
- AC: AC-2.

**T4 — Header + Sign (hero)**
- Goal: the first viewport is complete.
- Files: `Header`, `HalfMark`, `Sign`, `OpenStatus`.
- Depends on: T2, T3.
- Verify: screenshots at 390/1440; e2e for AC-1, 3, 4.
- AC: AC-1, 3, 4, 17.

**T5 — Kaapi by two + figure drawings**
- Goal: the ritual explained with four drawings.
- Files: `ByTwo`, `figures/*`.
- Depends on: T2.
- Verify: screenshot; AC-5 test.
- AC: AC-5, 22.

**T6 — The Board** [P]
- Goal: the menu plate.
- Files: `Board`.
- Depends on: T2, T3.
- Verify: screenshot; AC-6 test.

**T7 — House Rules** [P]
- Goal: the rules plate.
- Files: `Rules`.
- Depends on: T2, T3.
- Verify: screenshot; AC-7 test.

**T8 — Families** [P]
- Goal: two trades, two origins.
- Files: `Families`.
- Depends on: T2.
- Verify: screenshot.
- AC: R7.

**T9 — Visit + floor plan + long-table form + footer**
- Goal: the action section.
- Files: `Visit`, `FloorPlan`, `LongTableForm`, `Footer`.
- Depends on: T3, T4 (`OpenStatus`).
- Verify: screenshots; AC-8–11 tests.

**T10 — Motion**
- Goal: reveals + figure draw-in per motion.md.
- Files: `global.css`, `Base.astro`, `ByTwo`.
- Depends on: T5–T9.
- Verify: manual scroll check; AC-21 test with reduced motion.

**T11 — Responsive + accessibility pass**
- Goal: 320–1920 px clean; axe clean.
- Files: any.
- Depends on: T10.
- Verify: AC-15, 16, 18, 20 tests; screenshots at 320/768.

**T12 — Visual QA, Vibe-Code Detection Pass, Creative Director review → refine**
- Goal: fix the weakest areas first.
- Depends on: T11.
- Verify: before/after screenshots.

**T13 — Final audit**
- Goal: `npm run verify` green; `docs/evaluation.md` written; README updated.
- Depends on: T12.
