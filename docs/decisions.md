# Decision log

The newest decision goes at the bottom. Only decisions that are hard to reverse or that set the language are recorded.

---

## D1 — Creative direction

### Context
The brand ([PROJECT.md](../PROJECT.md)) joins Irani-café manners with South Indian filter coffee. Three genuinely different directions were explored before committing.

### Options considered

#### Concept A — "The Sign & the Board"
- **Thesis:** The website *is* the shopfront. It opens on the café's cobalt enamel sign, and the house rules board on the wall is a real piece of content. Every surface is something you would find in the room: sign, menu board, rules board, floor plan.
- **Emotional goal:** Recognition and affection, the feeling of a place that has been here for 60 years, then a small surprise that it's new.
- **Typography:** Condensed, heavy signage caps (Anek Latin, an Indian-foundry family, at narrow widths) for plates and headlines. A warm text serif (Newsreader) for voice. Telugu (Anek Telugu) appears only on the sign, as on real bilingual Hyderabad signage.
- **Colour:** Marble cream ground, warm ink, **cobalt enamel** as the one brand colour, and a little vermilion like rule numbers painted by a sign-writer. No gradients.
- **Composition:** Full-width "plates" alternating with open cream pages. The sign, the board and the rules are big flat set-pieces. Everything else sits on a 12-column editorial grid.
- **Imagery:** Technical line drawings (the filter, the tumbler and davara, the floor plan) in ink and cobalt, with numbered figure captions. Photography is documentary and natural-light when it arrives.
- **Interaction:** Physical and quiet. The sign is just there, no animation. The filter diagram draws once. The "open now" line is live. Hovering menu rows works like running a finger down a board.
- **Signature element:** The **½** mark and the **House Rules board**.
- **Commercial strength:** You couldn't swap in another café's name. It sells the visit (the room) and the ritual (by two), and the rules give regulars something to quote.
- **Risks:** Nostalgic kitsch, with Irani-café clichés used as costume. Too many plates could become a wall of boxes. Without photos it could feel cold.

#### Concept B — "Estate Ledger"
- **Thesis:** A field journal from the two origins (Baba Budangiri and Araku) that ends at a cup in Abids. The site reads like a slow, long-form magazine feature.
- **Emotional goal:** Curiosity and respect: "these people really know their coffee."
- **Typography:** A high-contrast editorial serif, generous drop caps, footnotes and marginalia, small-caps metadata (altitude, process, harvest).
- **Colour:** Forest green, laterite red soil, paper. Muted and earthy.
- **Composition:** Magazine spreads with asymmetric columns, a contour-line map motif and pull-quotes.
- **Imagery:** Landscape and hands documentary: misty estates, drying beds, farmers.
- **Interaction:** Long scroll with chapter markers and a progress indicator.
- **Signature element:** A hand-drawn altitude/contour line running through the page.
- **Commercial strength:** It builds authority and suits wholesale or retail beans.
- **Risks:** "Origin storytelling" is the most common specialty-coffee trope there is. It sells beans, not a visit. It depends entirely on photography we don't have. Visit and hours get buried.

#### Concept C — "Eleven Minutes"
- **Thesis:** The café as it is *right now*. The page changes with Hyderabad time: morning decoction, afternoon laptops, evening conversation, and Sunday book market at 7. The decoction's eleven-minute drip is the clock.
- **Emotional goal:** Immediacy and FOMO: "it's happening now, go."
- **Typography:** A modern grotesk with oversized tabular numerals (clock and prices). Minimal.
- **Colour:** Dark and cinematic. Near-black, with warm tungsten highlights that shift by time of day.
- **Composition:** One full-screen "now" panel, followed by a compact timeline of the day.
- **Imagery:** Moody low-light photography, steam, hands, motion blur.
- **Interaction:** Live, driven by time of day. A circular eleven-minute drip timer.
- **Signature element:** The live "now pouring" panel.
- **Commercial strength:** Very useful: open or closed, and what's on, at a glance.
- **Risks:** Dark moody café sites are common. The time gimmick hides content at the "wrong" time. It is fragile to test and has little brand personality beyond the clock.

### Evaluation (1–5)

| Criterion | A · Sign & Board | B · Estate Ledger | C · Eleven Minutes |
|---|---|---|---|
| Distinctiveness | **5** | 2 | 3 |
| Brand clarity | **5** | 4 | 3 |
| Emotional impact | 4 | 3 | 4 |
| Commercial credibility | **5** | 4 | 3 |
| Usability | 4 | 3 | 4 |
| Content scalability | 4 | 4 | 2 |
| Technical feasibility | 4 | 3 | 3 |
| Mobile quality | 4 | 3 | 4 |
| Memorability | **5** | 2 | 4 |
| Works without photography | **4** | 1 | 2 |
| **Total** | **44** | 29 | 32 |

### Decision
**Concept A, "The Sign & the Board"**, with two deliberate borrowings:
- From **C**: the live *open-now* line (open or closed, closing time, and the Sunday 7 am exception), shown once at the top and in Visit. It is a utility, not a theme. The page does not change with time of day.
- From **B**: one short, sharp section on the **two origins**, written as a statement of where the two coffees come from rather than a long-form journal.

### Trade-offs
- The nostalgia risk is controlled by the voice: dry, current, never "olde". The palette is enamel-clean, with no sepia, distress texture or fake grunge.
- The "too many plates" risk is controlled by a hard limit: **three** solid plates on the page (the sign, the board and the rules). Everything else sits on open paper.

### Consequences
Typography and line drawings carry the identity, and photography is additive. The rules board and the sign must be built as real HTML text (accessible and translatable), not images.

---

## D2 — No AI-generated or stock photography

### Context
No client photography exists. Unsplash blocks automated access. A test generation with Canva's image tool produced only a 200 px preview, and the full file needs the user's Canva login. Stock photos of *other* cafés would misrepresent the room.

### Options considered
1. Random stock photography. Rejected: incoherent, and it shows someone else's café.
2. AI-generated comp photography. Rejected: it isn't retrievable at production resolution, and generated food photography on a café's site misleads customers about what they will be served.
3. **An illustration-led system with photography slots, plus a shoot brief.** Chosen.

### Decision
Identity comes from type and precise SVG line drawings (figure-plate style: filter, tumbler and davara, floor plan). The layout has **no empty photo frames**. Photography is specified in [art-direction.md](art-direction.md) as a shoot brief, and slots are added when real photos exist.

### Trade-offs
It is less immediately "appetising" than a hero food photo, and it relies on the illustrations being well drawn.

### Consequences
Real photography is the #1 pre-launch item in [evaluation.md](evaluation.md).

---

## D3 — Stack: Astro, static output, no UI framework

### Context
The repo was empty. The deliverable is one marketing page with three small interactive behaviours: the live hours line, the mobile navigation and the long-table request form.

### Options considered
- Next.js / React: SSR and a React runtime are unnecessary for a static page, and a heavy client bundle is unjustified.
- Plain HTML + Vite: no components or content data files, so partials get duplicated.
- **Astro:** component templates, zero JS by default, TypeScript, static build, scoped CSS.

### Decision
Astro with plain scoped CSS plus a single tokens file. No Tailwind. Small TypeScript `<script>`s for the three behaviours. Content lives in typed data files in `src/data/`.

### Trade-offs
Contributors need to know Astro. Without a utility CSS framework, CSS discipline depends on the tokens file and conventions in [design-system.md](design-system.md).

### Consequences
The page ships about 0 KB of framework JS. A future CMS can feed `src/data/` without touching components.

---

## D4 — Fonts: Anek Latin + Anek Telugu + Newsreader, self-hosted

### Context
Signage needs a condensed heavy face. The voice needs a warm serif. The sign needs Telugu that harmonises with the Latin.

### Decision
- **Anek Latin (variable width and weight)** and **Anek Telugu** are by Ek Type, a Mumbai foundry. A single family covers condensed signage caps and labels, and its Telugu sibling matches the Latin by design.
- **Newsreader (variable, optical size)** is used for body, ledes and menu descriptions. Its italics carry the dry asides.
- Fonts are self-hosted through Fontsource: no third-party font requests, and preloaded.

### Rejected
Fraunces, Playfair and Instrument Serif (the "premium template" defaults), and Abril Fatface (cliché). Painted-sign script faces were also rejected because they push the concept into kitsch.

---

## D5 — Booking: the long table only, via a pre-filled WhatsApp message

### Context
Irani cafés don't take reservations. The brand keeps that: walk-in only, except the one long table (8–10 seats). There is no backend.

### Decision
A short form (name, date, time, party size) builds a pre-filled `wa.me` message to the café's WhatsApp number. That is the normal booking channel for small businesses in Hyderabad. The number is set in `src/data/site.ts`.

### Trade-offs
There is no confirmation inside the site. The form states plainly that the café will confirm on WhatsApp. A real booking system is out of scope.

---

## D6 — Tooling: Playwright as the single test runner, using the system Chrome

### Decision
`@playwright/test` runs pure-logic tests (the hours/open-now function) without a browser, as well as e2e, accessibility (axe) and screenshot capture, using the installed Chrome (`channel: 'chrome'`) so no browser download is needed. `astro check` handles typechecking, and ESLint with the Astro and jsx-a11y plugins handles linting.

### Trade-offs
Pure-logic tests through Playwright are unconventional, but one runner is better than two for a site this size.

---

## D7 — Subset faces for Telugu and ₹; the rupee is always set in Anek

### Context
The first measured build transferred **745 KB**, of which about 720 KB was fonts. Three avoidable causes: the full Anek Telugu face (137 KB) for six glyphs on the sign, the `·` between the Telugu words pulling in Anek Telugu's Latin subset (42 KB), and `₹` pulling in the latin-ext files of both Anek (81 KB) and Newsreader (85 KB).

### Options considered
1. Accept the weight. Rejected: 720 KB of type for one page is not client-grade.
2. Use the system Telugu font. Rejected: it breaks the Anek Latin/Telugu harmony that justified D4.
3. **Subset at build time.** Chosen.

### Decision
- `subset-font` (harfbuzz, dev-only) builds `anek-telugu-sign.woff2` (10 KB, shaping intact) and `anek-rupee.woff2` (1.8 KB, variable axes kept) with `npm run fonts:subset`. The outputs are committed in `src/assets/fonts/`.
- `--font-sign` lists `'Anek Rupee'` first, so ₹ never triggers Anek's latin-ext file.
- Rupee amounts inside Newsreader text are wrapped and set in Anek (`.price`, `.item__bytwo`), so Newsreader's latin-ext file is never needed.

### Trade-offs / consequences
Page weight dropped from 745 KB to **411 KB** with no visual change. If the sign's Telugu text changes, re-run `npm run fonts:subset`. A ₹ inside unwrapped body text would silently re-add 85 KB, so it must stay inside a sign-font span.

---

## D8: Decoction brown replaces cobalt (supersedes D1's colour)

### Context
The client's review: "the whole site is not looking like it is a coffee website because the theme is blue." Cobalt came from the enamel-sign concept, but a café site has to read as coffee in the first second.

### Decision
The sign concept stays, in brown enamel. The tokens keep their names (`--enamel` is "the enamel plate colour") and change value: decoction brown `#4A2C1D` as the brand colour, milk-cream paper, espresso ink, and a new `--crema` caramel accent for dark grounds. Vermilion is kept for numbers and "today". Drawn liquid is brown.

### Consequences
The swap touched only `tokens.css`, the meta theme colour and the favicon. All contrast pairs were re-verified (table in design-system.md). Crema fails on paper (2.5:1), so it is decorative there.

---

## D9: Client photography + hero intro (supersedes D2)

### Context
The client wants photos of the drinks and an opening video followed by an animation. They will supply the media and chose: the video plays **in the hero** (the site is never blocked), and the animation is the **pour and split**.

### Decision
- **Hero stage:** muted video → `HeroPour` drawing → the sign settles. It runs on the first visit per session and is skippable. Replay appears only when a video exists. Reduced motion, Save-Data, autoplay failure and no-JS all have defined fallbacks (`src/lib/intro.ts`, motion.md).
- **"In the cups":** one 4:5 photo per drink, picked up by filename = menu item id, optimised by `astro:assets` (AVIF/WebP, responsive). It is placed after "Kaapi, by two", before the full board.
- **Graceful before files arrive:** no video means the pour plays once. No photos means no section and no nav link. The tests adapt to whatever media is present.

### Trade-offs
A first visit with video costs up to 4 MB (budget enforced by test). The video is `preload="none"` when a poster exists, so repeat and reduced-motion visitors never download it.

---

## D10: Full-screen opening, no controls (supersedes the hero stage in D9)

### Context
Client review of D9: "the intro should occupy the whole page… after that the animation should begin… there shouldn't be any option like Skip Intro… it looks as if a video is being played; it should look like an animation." They also asked for the generator's watermark to be removed.

### Decision
- **`Intro.astro`:** a fixed, full-window layer above the page with no buttons and no player chrome, and page scroll locked.
  1. The video plays edge to edge. On portrait screens a script-driven "camera" pans with the stream: the left cup, then the right.
  2. When the video ends, the frame darkens and **`IntroTrace.astro` draws over the real tumblers in the final frame**. It is drawn in the video's own 1280×720 coordinates, so the lines land on the cups at any window size. The pour then splits into both, and the ½ mark draws between them.
  3. The layer lifts like a shutter and the sign settles once.
- **The hero returns to the plain sign on paper.** The boxed stage, Skip and Replay are removed.
- **Safeguards that are not visible options:** reduced motion and repeat visits in the session never see the opening. Keyboard users press Esc/Tab/Enter/Space to bring the site up at once (WCAG 2.1.1/2.2.2). Blocked autoplay or a stall goes straight to the drawing over the final frame. No JS means no opening. An inline failsafe uncovers the page if the module script never runs.
- **Watermark:** removed by re-encoding in Chrome. The sparkle is a fixed semi-transparent overlay, so its alpha map was fitted across light and shadow frames and reversed per frame (`bg = (p − aW)/(1 − a)`), with the edge band softened. The audio track was dropped. The original is backed up locally in `qa/originals/` (gitignored).

### Trade-offs
- The opening is about 14 s on a first visit, and visitors can't skip it except by keyboard: the client's explicit choice.
- The video is preloaded only when the opening will run (`preload="none"` otherwise).
- `intro-poster.png` (client-supplied) is unused. The fallback and poster is the video's own cleaned last frame, `intro-end.jpg`, because the trace geometry must match it.

**Amendment (same day, client review):** the opening fills the window **below the header**. The header (½ wordmark, nav, Directions) stays visible and usable on top. Any click in it ends the opening at once, so the link lands on the real page. The shutter lifts up under the header.

---

## D11: A coded opening animation replaces the video (supersedes D10's video)

### Context
Client review: "removing the video will make it fine because the video is not good. It is not matching the theme… create an animation by yourself."

### Decision
`IntroAnimation.astro` is drawn in the figure-plate language: cream lines and crema liquid on espresso, in the panel below the header (D10's layout is kept). It runs in three acts, about 5.3 s, then the shutter lift:
1. **The decoction drips** (0–2.1 s): the filter draws, three drops fall, and the lower chamber fills.
2. **Poured from a height** (2.1–4.0 s): the filter makes way, a tipped tumbler pours, the stream splits, and two tumbler-and-davara sets draw and fill.
3. **Shared, by two** (4.1–5.3 s): the ½ mark draws between the cups.

Captions crossfade in sign type. It is CSS keyframes only, with no video and no media download. The JS state machine shrank to `animating → lifting → done`. All safeguards are kept: reduced motion, once per session, keyboard bypass, header clicks end it, failsafe.

### Consequences
- The video, its end frame and the client poster are removed from the site; the originals are kept locally in `qa/originals/`.
- The first-visit cost dropped from about 2.5 MB to about 0.4 MB, and the opening from about 14 s to about 6 s.
- `IntroTrace.astro` and the watermark tooling are retired.

---

## D12: Fictional names; location is the city only

### Context
Client request: "replace all the real names with fictional names, but good enough… for the location, don't put it specifically. Just put Hyderabad."

### Decision
| Was (real) | Now |
|---|---|
| Abids, Chirag Ali Lane, 5-8-412, PIN, Abids GPO, Gandhi Bhavan metro | **Hyderabad** (address, sign band, floor plan, title, Maps query) |
| Zoya Irani · Pranav Gowda | **Shirin Darashah** · **Kiran Malnad** |
| Yazd, Secunderabad clock tower | "from Persia… a tea room in the old city" |
| Baba Budangiri / Chikmagalur / the Baba Budan legend / Yemen | **Mallige Hills** estate |
| Araku Valley · Adivasi cooperatives | **Neeli Valley** · hill-farmer cooperatives |
| Anakapalli jaggery · "the Secunderabad way" | cane jaggery · "the old-city way" |

Dish and style names (Irani chai, Osmania biscuits, Monsooned Malabar, Sulaimani, kaapi) are kept: they name things, not people, places or businesses.

### Consequences
The sign's bottom band reads "Kaapi · Chai · Bakes · Hyderabad". Visit shows the city and a landmark line ("Look for the brown enamel sign above the door"); the metro line is removed. Historical entries above (D1–D11) keep the names they were written with.

---

## D13: The opening plays on every load

Client request: "make the animation play whenever I reload the site." The once-per-session memory is removed: every load and reload plays the ~6 s opening. Reduced motion still skips it, and the keyboard and header-click bypasses remain. Automated tests and the screenshot script opt out through the session key `obt:intro-off`, which visitors never set.

---

## D14: A smooth, animated page; the drinks become highlighted cards

### Context
Client: "make this landing page smooth and animated… make sure the cards for whatever types of coffee we are offering are highlighted." Full creative freedom given.

### Decision
- **Smooth scrolling with Lenis** (MIT, the only new runtime dependency). Total JS stays at **8.6 KB gz** (budget 15 KB). It is off under reduced motion and paused during the opening.
- **A reveal system with variants**, masked headings and shutter-opening dark bands, plus per-section choreography: leaders that draw, a slash that draws, a blend bar that pours, a floor plan that draws, staggered rows. See motion.md.
- **A header that steps aside** on scroll down, a scroll-spy underline and a reading-progress line.
- **"In the cups" rebuilt as the featured section:** an espresso band; the house order as a wide enamel plate; the other drinks as **enamel menu-plate cards** (the sign's own ground-plus-rim construction). They have cursor tilt and light, a crema rim, photo zoom and scroll parallax, become a swipe carousel on phones, and **each links to its board row, which flashes on arrival**.

### Rules changed
- The "no cards" rule is lifted **for drink cards only**: they are a café object (menu plates), not generic UI.
- The "restrained motion" rules in motion.md are replaced by the system above. No loops, bounce or scroll-jacking remain.

### Verified
95 tests pass (6 device-specific skips) over two consecutive runs. These include header hide/show and scroll-spy, card links with the board flash, tilt on desktop only, Lenis on/off, reduced motion leaving nothing hidden or displaced, and CLS < 0.1 through a full scroll. Bugs found on the way:
- Side reveals created a 32 px horizontal overflow at 320 px (fixed with `main { overflow-x: clip }`).
- Small crema labels on enamel failed contrast at 4.2:1 (now cream).
