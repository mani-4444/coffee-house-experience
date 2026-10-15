# CLAUDE.md

## Project purpose
A one-page marketing site for **One by Two**, a fictional specialty coffee house in Hyderabad (Irani-café manners, South Indian filter coffee). All names are fictional and the location is the city only (D12). It is built to client-ready standard. The brand is in `PROJECT.md`, requirements and ACs are in `SPEC.md`, and the *why* is in `docs/decisions.md`.

## Commands
- Install: `npm install` (Playwright uses the system Chrome, so no browser download is needed)
- Dev: `npm run dev` → http://localhost:4321
- Build: `npm run build` · Preview: `npm run preview`
- Lint: `npm run lint` (ESLint) · `npm run lint:tokens` (no raw hex outside tokens.css)
- Typecheck: `npm run check`
- Tests: `npm test` (builds first; unit + e2e + axe)
- Everything: `npm run verify`
- Screenshots: `npm run shots` (needs `npm run build` first) → `qa/shots/` at 320/390/768/1440
- Font subsets: `npm run fonts:subset` (only when the sign's Telugu text changes)

## Definition of done
`npm run verify` is green **and** you have looked at `npm run shots` output at 390 and 1440 for every visual change. If a lasting decision changed, update the docs it touches.

## Design principles
- Every element is an object from the café: sign, board, rules, figure plate, floor plan. If it isn't one, it is type on paper.
- One brand colour: decoction brown (`--enamel`), with crema as its accent on dark grounds (D8). Vermilion only for numbers and "today/now".
- Specific beats impressive. Local facts beat adjectives.

## Architecture boundaries
- Content lives in `src/data/*`, time logic lives in `src/lib/hours.ts` (pure, no DOM), and sections are `src/components/*`, composed only in `src/pages/index.astro`.
- Scripts hook onto `data-*` attributes, never onto styling classes.
- Colours, fonts, space and motion come from `src/styles/tokens.css` only.

## Conventions
- Component CSS is scoped in the `.astro` file and uses `var(--token)` only.
- Copy is in British-Indian English (colour, centre). Prices are `₹` plus a number with no decimals.
- SVG drawings follow `docs/art-direction.md`: 240-unit plates, the `.drawing` classes in `global.css` (`.ln`, `.hid`, `.anno`, `.liquid`, `.stream`, `.dots`), elevation or plan only.
- Pure logic (`src/lib/*`) is unit-tested without a browser. Booking rules live in `src/lib/booking.ts`, not in the form script.
- In-page links go through `src/scripts/smooth.ts` (Lenis + focus + `obt:arrive`). Don't add separate anchor handlers.

## Ask first
Adding any dependency (runtime deps today: astro, fontsource fonts, lenis) · changing the stack · adding a page/route · removing or reordering a section · changing a colour, font or the sign · adding photography.

## Never
- Shadows, gradients as decoration, pill buttons, icon packs, emoji, glass effects. Cards only for drinks, as enamel menu plates (D14).
- Generic copy ("crafted", "artisanal", "elevate", "brewed to perfection") or placeholder text.
- Raw hex in components (the token lint will fail).
- Weakening, skipping or deleting tests to get green.
- Loops, bounce, scroll-jacking, or animating layout properties. Motion goes through the reveal system in `global.css` (`[data-reveal]` variants, `.mask-reveal`, `.band-reveal`, `--i` stagger); see docs/motion.md (D14).
- Visible controls on the opening (client decision, D10/D11). Keep the invisible safeguards: reduced motion, keyboard bypass, header clicks, failsafe. It plays on every load (D13).

## Visual quality bar
Each section must survive this question: *could this exact section appear on another café's site with the name changed?* If yes, redo it.

## Verification requirements
Visual changes need screenshots, behaviour changes need a Playwright test, and logic changes need a unit test in `tests/hours.spec.ts` (or a sibling file).

## Known gotchas
- Open-now must use `Asia/Kolkata`, never the browser timezone. Tests set the browser timezone elsewhere on purpose.
- Reveal/hidden styles apply only under `html.js` + `prefers-reduced-motion: no-preference`. Never hide content by default.
- Anek's `wdth` axis needs `font-stretch` (e.g. `75%`), with the variable font file loaded from `@fontsource-variable/anek-latin/wdth.css`.
- Line drawings: never select by `[pathLength]` in CSS. Chrome won't restyle on an ancestor class change. Draw-in targets are `.ln *`, `.anno path`, `.stream`, and each must carry `pathLength="1"`. Use keyframes, not transitions, for `stroke-dashoffset`.
- Astro 7 allows one `astro preview` per project. Scripts use `--force` and `npx astro preview stop`.
- Fonts: Telugu on the sign and the ₹ glyph come from subset files (`npm run fonts:subset`, D7). Changing the sign's Telugu means re-running it. A ₹ in Newsreader body text adds 85 KB, so wrap rupee amounts in a sign-font span (`.price`).
- Client media (D9): drink photos in `src/assets/drinks/<menu-item-id>.png|jpg`. No photos → no Cups section. The opening is coded (`IntroAnimation.astro`, D11), with no video.
- Page tests import `test` from `tests/fixtures.ts` (sessionStorage 'obt:intro-off', so the opening stays out of the way). Only `media.spec.ts` uses the raw `test`.
- Astro `<Picture>` writes width/height attributes, so photo CSS needs `height: auto` or `aspect-ratio` is ignored.
- Side-entering reveals start off-canvas: `main` has `overflow-x: clip`. Keep it `clip`, not `hidden`, or sticky breaks.
- All contact details are fictional (`src/data/site.ts`).
