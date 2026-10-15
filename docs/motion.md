# Motion

**Brand rule (D14):** the café is unhurried and exact, and the page should feel the same: smooth, continuous and alive as you move through it. Motion eases in slowly and settles cleanly. It is never bouncy and never loops. Every effect is switched off by `prefers-reduced-motion: reduce`.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, reveals |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Line draw, slash, shutter |
| `--dur-quick` | `160ms` | Hover, focus, colour changes |
| `--dur-base` | `320ms` | Header hide/show, button sweep, nav underline |
| `--dur-slow` | `900ms` | Section reveals, line drawing |
| `--stagger` | `70ms` | Delay step between siblings (`style="--i: n"`) |

## The systems

| System | Where | How |
|---|---|---|
| **Smooth scrolling** | Whole page | Lenis (`src/scripts/smooth.ts`): wheel/trackpad inertia (touch stays native). Paused during the opening. In-page links smooth-scroll below the header, update the URL, move focus and fire `obt:arrive` |
| **Reveals** | Every section | `[data-reveal]` + `.reveal` (variants `rise`, `left`, `right`, `scale`), `.mask-reveal` headings (text slides up from a clip), `.band-reveal` dark bands (clip opens to full bleed). One IntersectionObserver in `Base.astro` adds `.is-in` once |
| **Header** | `Header.astro` | Hides on scroll down after 140 px and returns on scroll up (never while focused, in the menu or during the opening). Scroll-spy marks `aria-current`, and one underline slides to the current link. A crema reading-progress line uses `animation-timeline: scroll()` where supported |
| **Opening** | `Intro.astro` (D11/D13) | Every load: filter drips → pour by two → ½, then the shutter lifts and the sign settles |

## Choreography by section

| Section | Motion |
|---|---|
| Hero | Premise and CTAs stagger in. The primary button gets a deeper-brown sweep on hover |
| Kaapi, by two | Masked heading. Plates rise in sequence. Figures draw themselves |
| **In the cups** | Band opens. Masked heading. The house-order plate scales in and its ½ rotates in. Cards rise in rows of three. Photos drift ±5 % with scroll (`view()` timeline). **Hover (fine pointers):** the card tilts toward the cursor (±5°), lifts 6 px, the rim turns crema, a soft light follows the cursor, the photo zooms 1.06, and the arrow nudges. **Mobile:** swipe carousel, with the centred card at full scale and its neighbours at 0.9 (`view(inline)` timeline) |
| The board | Band opens. Masked heading. The pour-over insert slides from the right. Rows cascade, each **dotted leader draws left→right**, then the price appears. Arriving from a card **flashes the row** crema |
| House rules | Plate scales into place. Rules arrive in pairs. Numerals slide up |
| Families | The two sides slide in from opposite edges. **The slash draws downward**. The blend bar pours in (70 %, then 30 %) and the key fades in |
| Visit | **The floor plan draws itself**, and the long table fills last. Hours rows cascade, and today's row gets one crema sweep |
| Footer | Rule 09 rises in |

## Never
Loops, bounce, scroll-jacking (Lenis smooths but never snaps or hijacks), cursor followers outside cards, marquees, animated counters, and animating the rules text itself. Never animate layout properties: only `transform`, `opacity`, `clip-path` and `stroke-dashoffset`.

## The opening, precisely (D11)
- State lives on `<html data-intro>`: `pending` → `animating` → `lifting` → removed. `initialIntroState()` (`src/lib/intro.ts`): plays on every load; reduced motion (or the test-only `obt:intro-off` session key) → `done`.
- An inline script sets `pending` before first paint (so the site never flashes first), and removes it after 4 s if the module script never runs.
- Every drawn element carries `--d` (ms from the start). `ANIMATION_MS` in `intro.ts` must cover the last `--d` plus its duration.
- An SVG element with a `transform` attribute must not also be animated with a CSS transform (the CSS replaces the attribute): position it on a wrapping `<g>`.

## Implementation notes
- Hidden-until-revealed states apply only under `html.js` **and** `@media (prefers-reduced-motion: no-preference)`. Without JS or with reduced motion, everything renders in its final state (tested: AC-21, AC-32).
- Side-entering reveals start off-canvas, so `main { overflow-x: clip }` prevents horizontal scroll (`clip`, not `hidden`: no scroll container, sticky is unaffected).
- Line draw-ins use `@keyframes` or `.is-in` transitions on elements with `pathLength="1"`, selected by class, never by `[pathLength]`.
- Scroll-driven effects (`animation-timeline`) are progressive: inside `@supports`, transform-only, never hiding content.
- The tilt is rAF-throttled CSS variables (`--rx`, `--ry`, `--mx`, `--my`) on `[data-tilt]`, only on `(pointer: fine)`.
