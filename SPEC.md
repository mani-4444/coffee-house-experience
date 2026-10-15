# SPEC — One by Two website

Read with: [PROJECT.md](PROJECT.md) (brand), [docs/information-architecture.md](docs/information-architecture.md) (structure), [docs/design-system.md](docs/design-system.md) (tokens), [docs/decisions.md](docs/decisions.md) (why).

## Context & goal

This is a one-page site for One by Two, a specialty coffee house in Hyderabad, that serves South Indian filter coffee in the manner of an Irani café. The goal is **footfall**: a visitor should leave the page knowing where it is, whether it's open, what to order and who to bring.

## Users & scenarios

- **S1, the first-time visitor (mobile, on the way):** "Is it open right now and how do I get there?" → answered on the first screen.
- **S2, the curious specialty drinker (desktop, evening):** "What's different here?" → the ritual, the board and the families.
- **S3, the regular (mobile):** "What are the prices / what's on the pour-over?" → nav → The Board.
- **S4, the book-club organiser:** "Can I book for 8 people on Sunday?" → nav → Visit → long-table form → WhatsApp.
- **S5, the keyboard / screen-reader user:** completes S1 and S4 without a mouse.

## Brand requirements

- **B1** Voice follows PROJECT.md: dry, warm, exact. No exclamation marks, emoji, "crafted", "artisanal", "brewed with love" or "elevate".
- **B2** The ½ mark and the brown enamel sign appear in the first viewport (after the intro on a first visit).
- **B3** Copy is specific: the city (Hyderabad only, D12), the Sunday book market, the two families and the two (fictional) origins, Mallige Hills and Neeli Valley.
- **B4** Only one brand colour, decoction brown, with crema as its accent (D8). Vermilion is an accent of under 2% of the surface.

## Functional requirements

| ID | Requirement |
|---|---|
| R1 | The hero shows the café name as the page's only `<h1>`, the descriptor (coffee house · Hyderabad), a one-line premise, and two actions: **Get directions** (primary) and **See the board**. |
| R2 | A live **open-now line** is computed in `Asia/Kolkata` time from `site.ts` hours. It reads "Open now · until {close}" or "Closed · opens {day} {time}". Without JS it degrades to static hours text. |
| R3 | The header stays reachable while scrolling, links to `#by-two`, `#board`, `#rules` and `#visit`, and has a Directions link. On ≤ 900 px the links are behind a Menu toggle. |
| R4 | The ritual section explains *kaapi by two* in four numbered steps, each with a line drawing and caption, and states the price for two. |
| R5 | The board renders every item from `menu.ts`: name, note and price in ₹. Items with a by-two price show both. It includes an "On the pour-over today" callout. |
| R6 | The house-rules section renders all rules from `rules.ts` as an ordered list. |
| R7 | The families section names both families, both origins and the blend ratio. |
| R8 | The Visit section shows the city, a landmark line, a weekly hours table with **today highlighted**, the live status, a Directions link (Google Maps, new tab), phone, and a floor plan of the room. |
| R9 | The long-table form collects name, date, time, party size (6–10) and optional note, validates them in-page, and on submit opens `wa.me/{number}?text={prefilled message}`. It states that booking is confirmed on WhatsApp. |
| R10 | The footer repeats the name, address, hours summary, phone, email and Instagram. |
| R11 | On every page load a coded opening animation (filter drips → pour splits into two tumblers → ½) fills the window below the header, then lifts onto the site. It has no visible controls (client decision). Reduced motion never sees it, and keyboard keys and header clicks bring the site up. |
| R12 | "In the cups" shows each photographed drink as a highlighted enamel-plate card (the house order leads as a wide plate), in board order, with name, price and note. Each card links to its board row, which flashes on arrival. It is hidden when no photos exist. |
| R13 | The page scrolls smoothly (Lenis, wheel/trackpad), and sections animate in as they arrive. The header hides on scroll down and returns on scroll up, with a scroll-spy underline. All of this is off under reduced motion. |

### Acceptance criteria

- **AC-1 (R1):** WHEN the homepage loads at 1440×900 and at 390×844 THEN the `<h1>` text contains "One by Two", AND the Get directions link and the See the board link are visible without scrolling.
- **AC-2 (R2):** GIVEN Tue–Sat 08:00–22:00 and Sun 07:00–22:00 hours, closed Monday (IST):
  - at Wednesday 10:00 IST the line reads "Open now · until 10 pm";
  - at Monday 12:00 IST it reads "Closed · opens Tuesday 8 am";
  - at Sunday 07:05 IST it reads "Open now · until 10 pm";
  - at Saturday 23:00 IST it reads "Closed · opens Sunday 7 am";
  - at Tuesday 07:30 IST it reads "Closed · opens today 8 am";
  - the result is the same regardless of the browser's own timezone.
- **AC-3 (R2):** WHEN JS is disabled THEN the hero shows the static hours summary and no empty status element.
- **AC-4 (R3):** WHEN a nav link is activated THEN the URL hash changes and the target heading is in the viewport, not hidden under the header. AT 390 px wide THEN the four links are hidden until Menu is activated; Menu has `aria-expanded` that toggles; Escape closes it and returns focus to the toggle.
- **AC-5 (R4):** The `#by-two` section contains exactly four figures, each with an `<svg>` (`role="img"` + accessible name) and a caption, and the text "₹120".
- **AC-6 (R5):** The number of rendered board items equals the number of items in `menu.ts`, and every price is prefixed with "₹".
- **AC-7 (R6):** `#rules` contains an `<ol>` with one `<li>` per entry in `rules.ts`.
- **AC-8 (R8):** `#visit` contains an hours table with 7 rows, and exactly one row has `aria-current="date"` matching the current IST weekday.
- **AC-9 (R9):** WHEN the form is submitted empty THEN no navigation happens, focus moves to the first invalid field, and each invalid field shows a visible text error linked by `aria-describedby`. WHEN it is submitted valid THEN a `wa.me` URL is opened whose decoded text includes the name, date, time and party size.
- **AC-10 (R9):** The party-size input refuses values below 6 or above 10, with an error message that says why.
- **AC-26 (R11):** WHEN a first visit loads THEN the opening layer covers exactly the viewport below the header (the header stays visible; a click in it ends the opening), contains no buttons, links or controls, locks scroll, runs `pending → animating → lifting → done` in about 6 s, and then the sign is visible with the CTAs in the first viewport. A reload plays it again (D13).
- **AC-27 (R11):** WITH reduced motion there is no opening. Esc/Tab bring the site up within the lift time. Without JS there is no opening.
- **AC-28 (R12):** The number of Cups items equals the number of photo files matching menu ids, in board order. Each has alt text and an AVIF `srcset`. 
- **AC-29 (R13):** The header has `data-hidden="true"` after scrolling down past 140 px and `"false"` after scrolling up or when it holds focus. Scroll-spy gives exactly one nav link `aria-current="true"` for the section in view, and the underline moves to it.
- **AC-30 (R12):** There is one featured house-order card. Every card's `href` is an existing `#item-<id>`. Clicking a card lands that row in view with `.is-flash`. A fine-pointer hover sets `--rx`/`--ry`, and touch never does.
- **AC-31 (R13):** `html.lenis` is present with motion allowed and absent with reduced motion. Anchor links still update the URL and land below the header.
- **AC-32 (R13):** With reduced motion, no reveal target has opacity < 1 or a non-identity transform. CLS through a full scroll is < 0.1.
- **AC-11 (R10):** The footer contains the address and `tel:` and `mailto:` links.

## Visual requirements

- **V1** The page uses only the tokens in `src/styles/tokens.css`. There are no raw hex values in components.
- **V2** There are at most three solid plates (sign, board, rules), plus the footer. No card grids. Radius is used only on the two enamel plates (sign and rules), where it represents the physical object.
- **V3** No gradients, glassmorphism, drop-shadow cards or stock icons. Illustration is line drawing only, in ink and brown. Photography only from the client (D9).
- **V4** Display type is Anek Latin condensed. Running text is Newsreader. Telugu appears only on the sign.
- **V5** Every section is visually distinct in composition. No two consecutive sections share the same layout.
- **AC-12 (V1):** `grep -E "#[0-9a-fA-F]{3,8}" src/components src/pages` returns nothing (colours only via `var(--…)`). Enforced by `npm run lint:tokens`.
- **AC-13 (V2/V3):** The final screenshots show no gradient fills, no box-shadow cards, and radius only on the two enamel plates (reviewed in the Vibe-Code Detection Pass, [docs/evaluation.md](docs/evaluation.md)).

## Interaction requirements

- **I1** Hover and focus states exist for every interactive element and are distinct from rest.
- **I2** Ritual figures draw in once when scrolled into view. Nothing else animates on scroll except the subtle reveal defined in motion.md.
- **I3** Board rows highlight on hover, like a finger on the board.
- **AC-14:** Every link, button and input has a visible `:focus-visible` style with ≥ 3:1 contrast against its background.

## Responsive requirements

- **AC-15:** At 320, 390, 768, 1024, 1440 and 1920 px widths, `document.documentElement.scrollWidth` ≤ `innerWidth`, so there is no horizontal scroll.
- **AC-16:** At 390 px, every tap target (links, buttons, inputs) measures ≥ 44×44 px, except inline text links inside paragraphs.
- **AC-17:** At 390 px the sign remains legible: the name renders on ≤ 3 lines at ≥ 56 px font size and does not overflow the plate.

## Accessibility requirements

- **AC-18:** Zero axe-core violations (WCAG 2.1 AA tags) on the page at desktop and mobile widths.
- **AC-19:** All body text meets 4.5:1 contrast. Large display text meets 3:1. Verified by axe and the token contrast table in design-system.md.
- **AC-20:** One `<h1>`, with headings in order (no skipped levels), landmarks (`header`, `nav`, `main`, `footer`) and a "Skip to content" link as the first focusable element.
- **AC-21:** WITH `prefers-reduced-motion: reduce` the draw-in and reveal animations do not run. Content is visible immediately.
- **AC-22:** Decorative SVGs are `aria-hidden`. Meaningful drawings have `role="img"` and a label.

## Performance requirements

- **AC-23:** The built page ships ≤ 15 KB of JS (gzip) and no framework runtime.
- **AC-24:** Fonts are self-hosted, preloaded for the two critical faces, and use `font-display: swap`. No third-party requests on load.
- **AC-25:** No console errors or failed network requests on load (checked in e2e).

## Content requirements

- Real-feeling, specific copy everywhere. No lorem ipsum, "Coming soon", or "Your text here".
- Prices are in ₹ and believable for Hyderabad in 2026.
- Fictional contact details are centralised in `src/data/site.ts` and flagged in PROJECT.md.

## Out of scope

Online ordering, payments, a real booking backend, CMS, multi-page routes, i18n (beyond the Telugu on the sign), photography (see D2), analytics, cookie banners.

## Risks

| Risk | Mitigation |
|---|---|
| Irani-café nostalgia reads as kitsch | Clean enamel palette, no fake textures, contemporary voice (D1) |
| No photography makes it feel cold | Strong line drawings, warm paper, generous type; shoot brief ready (D2) |
| The sign breaks on narrow screens | AC-17, tested at 320 px |
| The WhatsApp hand-off confuses users | Explicit copy before and on the button (R9) |
| Timezone bugs in open-now | Pure function, tested with fixed instants (AC-2) |

## Open questions (for the real client)

1. Real address, WhatsApp number, Instagram handle and hours.
2. Photography budget and shoot date (brief in art-direction.md).
3. Is the long table bookable every day, or only on weekends?
4. Does "today's pour-over" change often enough to warrant a CMS field?

## Design references (principles, not copies)

- Enamel street and shop signage in Hyderabad and Mumbai: enamel ground, cream rim, condensed caps.
- The rules boards of old Irani cafés.
- Technical figure plates from 1950s instruction manuals: numbered figures and captions.

## End-to-end verification

`npm run verify` runs, in order: typecheck → lint → token lint → build → Playwright (unit + e2e + axe). Screenshots come from `npm run shots` at 390 / 768 / 1440 and are reviewed by eye, with results recorded in docs/evaluation.md.
