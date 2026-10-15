# Evaluation: final acceptance audit

**Date:** 2026-10-06 · **Build:** Astro 7.3.5 static · **Browser under test:** Google Chrome 154 (via Playwright `channel: 'chrome'`)

## Requirements → evidence

| Req | What | Evidence | Result |
|---|---|---|---|
| R1 | Hero: h1 name, descriptor, premise, two actions | `site.spec` AC-1 (accessible name, both CTAs above the fold at 1440×900 and 390×844) | ✅ |
| R2 | Live open-now line in IST, no-JS fallback | `hours.spec` (7 cases incl. host-zone independence) · `site.spec` AC-2 with the browser in New York · AC-3 with JS off | ✅ |
| R3 | Sticky nav, 4 anchors, Directions, Menu toggle ≤ 900 px | `site.spec` AC-4 (heading lands below the header; Escape closes and returns focus) | ✅ |
| R4 | Ritual in 4 figures + price | `site.spec` AC-5 | ✅ |
| R5 | Board renders all `menu.ts` items with ₹ prices + pour-over | `site.spec` AC-6 | ✅ |
| R6 | House rules as `<ol>` | `site.spec` AC-7 | ✅ |
| R7 | Families, origins, blend ratio | Visual review (screenshots below) | ✅ |
| R8 | Address, landmark, metro, hours with today, status, directions, phone, floor plan | `site.spec` AC-8 (exactly one `aria-current="date"`, IST weekday) + visual review | ✅ |
| R9 | Long-table form → WhatsApp | `booking.spec` (8 rule tests) · `site.spec` AC-9 (empty submit: focus + linked errors, no hand-off; valid submit: decoded `wa.me` text) | ✅ |
| R10 | Footer contact | `site.spec` AC-11 | ✅ |
| V1 | Tokens only | `npm run lint:tokens` (verified to catch a quoted `"#1f3b8f"` and to ignore `href="#add"`) | ✅ |
| V2–V5 | ≤ 3 plates, no cards, shadows or gradients, radius only on enamel, distinct sections | Vibe-Code Detection Pass below | ✅ |
| AC-14 | Visible focus everywhere | `site.spec` AC-14 tabs through every stop and measures ring contrast against the ground it is drawn on (≥ 3:1) | ✅ |
| AC-15 | No horizontal scroll 320–1920 | `site.spec` AC-15 | ✅ (failed at 320 until fixed) |
| AC-16 | Tap targets ≥ 44 px | `site.spec` AC-16 | ✅ |
| AC-17 | Sign legible on mobile | `site.spec` AC-17 + scripted check that the name fits the plate at 761/800/900/901/1024/1100 px | ✅ |
| AC-18 | axe WCAG 2.1 A/AA, 0 violations | `a11y.spec` desktop + mobile + open mobile menu | ✅ (failed on vermilion contrast until fixed) |
| AC-20 | Headings, landmarks, skip link | `site.spec` AC-20 | ✅ |
| AC-21 | Reduced motion | `site.spec` AC-21 (no hidden reveals, no dash arrays on drawings) | ✅ |
| AC-23 | JS ≤ 15 KB gzip, no framework | `build.spec`: about 3.5 KB gzip actual | ✅ |
| AC-24 | Self-hosted, preloaded fonts, no third parties | `build.spec` + `site.spec` request log | ✅ |
| AC-25 | No console errors or failed requests | `site.spec` | ✅ |

## Functional QA

`npm run verify` → `astro check` 0 errors · ESLint (Astro + jsx-a11y strict) clean · token lint clean · build OK · **62 passed, 4 skipped** (the skips are device-specific tests that only run on the other viewport).

Defects that tests found and that were then fixed:
- The h1 accessible name was "OnebyTwo", because Astro collapsed the whitespace between the word spans.
- Vermilion `#B5392A` failed AA (4.4:1) on the `paper-deep` ground. It is now `#A83223` (5.05:1).
- The primary-button focus ring inherited cream and was invisible over paper.
- The header overflowed by 13 px at 320 px.
- Booking dates formatted with an ICU-dependent comma.

## Visual QA

Screenshots reviewed at every iteration (`npm run shots`). Final evidence is in [`docs/screenshots/`](screenshots/): `320-fold`, `390-fold`, `768-fold`, `1440-fold`, `390-full`, `1440-full`. Interactive states were captured separately: mobile menu open, and the form after an invalid submit.

Visual defects found by looking, not by tests:
- Ritual drawings rendered as stray dots. Chrome never restyled the `[pathLength]`-selected strokes; they are now selected by class and drawn with keyframes. Recorded in CLAUDE.md.
- Fig. 3's "Tumbler" label was clipped at the plate edge.
- Mobile figure labels were about 6 px tall. Mobile now stacks each drawing at up to 320 px.
- The board's three columns were unbalanced (6 / 3 / 4 items). It is now Kaapi | Chai + Case.
- The families slash SVG stretched its grid row by about 350 px. It is now absolutely positioned.
- The header wrapped at 768 px ("KAAPI BY / TWO"). The nav now collapses at 900 px.
- The tablet sign looked timid. The name went from 15vw to 17vw, after confirming it still fits.
- The hero sign's mid-edge holes read as pixel noise. They now sit at the corners, matching the rules board.
- Footer hours wrapped mid-group.

## Vibe-Code Detection Pass

| Question | Verdict |
|---|---|
| Is the hero generic? | No. It is the café's actual shopfront sign: enamel plate, rim, mounting holes, bilingual band. |
| Default-website typography? | No. Indian-foundry condensed signage (Anek) against a warm text serif (Newsreader), with Telugu on the sign. |
| Too many cards? | None. The only bordered box is the pour-over "insert" on the board. |
| Rounded rectangles as decoration? | Radius exists only on the two enamel objects, where it describes the object. |
| Tailwind template? | No 3-up feature grid, testimonial carousel or centred CTA band. |
| Gradients to look premium? | No gradients anywhere. |
| Interchangeable sections? | No. Sign, figure plates, menu board, rules board, split/fraction, address + floor plan + form are each a different object. |
| Recognisable personality? | Yes: the house rules, "Rule 09", "We will think nothing of it", ₹60 a head. |
| Art-directed imagery? | The drawing set follows one spec (art-direction.md): one stroke weight, cobalt liquid, elevation/plan only, figure captions. |
| Works for another café with the name changed? | No. *By two*, Irani manners, Abids, the decoction and the long table run through every section. |

## Creative director review (what was prioritised)

1. **Strongest idea:** the enamel sign as hero, followed by the floor plan with the long table in cobalt.
2. **Weakest section:** the founders section, with dead space beside the title and a momentum dip after the rules. Fixed with a premise lede in the empty half, a heavier slash, and the blend bar as the payoff.
3. **Felt accidental:** the hero's mounting holes. Fixed.
4. **Over-designed:** nothing removed. Motion was already limited to one draw-in and one fade.
5. **Unfinished:** the tablet hero and header. Fixed.

## Accessibility QA

axe (WCAG 2.0/2.1 A + AA) passes at 1440 and 390 and with the mobile menu open. Keyboard: skip link first, every tab stop has a measured ≥ 3:1 ring, the menu supports Escape with focus return, and the form moves focus to the first invalid field. Errors are text with ✕ and `aria-describedby`, not colour alone. The "Today" marker is a word, not only colour. Reduced motion: everything renders in its final state. Lists keep `role="list"` for VoiceOver.

## Responsive QA

Widths tested by script: **320, 390, 768, 1024, 1440, 1920** (horizontal overflow), plus 761–1100 for sign fit. Reviewed by eye at 320, 390, 768 and 1440.

## Performance observations

| Metric | Value |
|---|---|
| Total transfer (full scroll, cold) | **411 KB** (was 745 KB before D7) |
| Fonts | 386 KB: Anek Latin 102, Newsreader 129 + italic 144, Telugu subset 10, ₹ subset 2 |
| JS | about 3.5 KB gzip, 4 small modules, no framework |
| HTML | 9.8 KB gzip |
| First contentful paint (local preview) | 148 ms |
| CLS | 0.001–0.003 |

## Remaining issues (honest)

1. **No photography.** This is the biggest gap against "create desire". The drawings carry identity but not appetite. The shoot brief is ready in [art-direction.md](art-direction.md); slots go into Families and Visit only (D2).
2. **All business details are fictional:** address number, phone, WhatsApp, email, Instagram handle, people, prices, and the metro walk time. The Instagram URL may point at someone else's account until replaced.
3. **Booking is a WhatsApp hand-off,** with no confirmation inside the site and no backend (D5, by design).
4. **No holiday or exception hours.** The open-now line follows the weekly table only. A real café needs a `closures` list in `site.ts`.
5. **Tested in Chrome only.** Safari and Firefox were not run. The features used (`text-wrap`, `:is()`, CSS `translate`, variable fonts) are supported in current versions, but the native date picker looks different and VoiceOver was not checked by hand.
6. **No social share image** (`og:image`). One is worth making from the sign once branding is final.
7. **Newsreader italic is 144 KB** for menu notes and asides. It could be subset to the site's character set if weight becomes a priority.
8. **At 320×640** the hero CTAs fall below the fold. The header's Directions button stays visible.

## Final verdict

> Does this meet the standard of a client-ready commercial coffee-shop website?

**Yes, as a design-and-build deliverable ready to present to a paying owner.** The brand is specific and believable, the visual system is coherent and documented, the narrative moves from sign to visit, mobile is designed rather than just stacked, and every acceptance criterion is backed by an automated check or a reviewed screenshot.

**It is not launch-ready until** items 1, 2 and 4 are resolved with the real client: photography, real details and holiday hours. These need the client's input, not further design iteration.

---

## Revision 2026-10-15: coffee palette, hero intro, drink photos (D8, D9)

**Client feedback:** "not looking like a coffee website because the theme is blue"; wants drink photos, and an opening video followed by an animation.

| Change | Evidence |
|---|---|
| Cobalt → decoction brown + milk cream + crema accent | Every text pair recomputed (design-system.md). axe (AC-18) and focus-ring (AC-14) tests pass. Screenshots in `docs/screenshots/` |
| Hero: video → pour-and-split → sign settles; skippable, once per session | `tests/intro.spec.ts` (state truth table) and `tests/media.spec.ts` AC-26/27: no layout shift, CTAs in the first viewport during the intro, Skip → focus to Replay, reduced motion, blocked autoplay, no-JS |
| "In the cups" drink photos (4:5, AVIF/WebP, responsive) | `tests/media.spec.ts` AC-28. The section and nav link appear only when photos exist |

**Verified with stand-in media.** A Chrome-encoded H.264 test clip, a poster and four placeholder drink images (generated in the gitignored `qa/`, removed after) gave 83/83 tests passing. Defects found and fixed this way:
- Focus was lost after Skip: the button was hidden before focus was read.
- Drink photos rendered about 4× too tall: `<Picture>` height attributes overrode `aspect-ratio`.
- "₹60" was invisible over the video.
- Replay covered the sign on mobile.
- An unlabelled photo filename is now reported at build ("photos with no matching menu item id").

**Current shipped state (no client media yet):** 79 passed, 8 skipped (the media-only checks). The page weight is unchanged at about 411 KB. First visits get the 2.6 s pour, then the sign.

**Open until the client's files arrive:** watch the real video through the intro at 390 and 1440, check the poster/last frame under the scrim, and review the real photos as one set (art-direction.md). The video adds up to 4 MB to a first visit.

### Client media installed (2026-10-15)
- **Files:** `public/media/intro.mp4` (H.264, 1280×720, 10 s, 1.9 MB, fast-start, carries an unused audio track), `src/assets/media/intro-poster.png`, and six drink PNGs (1122×1402) in `src/assets/drinks/`. All filenames match menu ids (no orphan warning).
- **Intro watched end to end in Chrome:** video 0–10 s → pour → settled at about 12.9 s, with no console errors. The pour veil was deepened (`--scrim-strong`) after review: the cream drawing competed with the real tumblers in the last frame.
- **Tests:** 83 passed, 4 skipped (device-specific), including AC-26/27/28.
- **Weight:** a first visit is about 2.5 MB, of which the video is 1.9 MB. A full scroll is about 2.6 MB. The drink photos ship as 150–230 KB total (from about 12 MB of PNG). Repeat visits and reduced-motion visitors never download the video.
- **Notes for the client:** the cortado image shows latte art, against the brief (minor). The full intro is about 13 s, so a 6–8 s cut would get visitors to the sign sooner. Skip is always available.

### Revision: full-screen opening (D10, 2026-10-15)
- **Client feedback:** the opening should fill the page, read as animation rather than an embedded video, have no Skip, and lose the generator watermark.
- **Watermark:** removed from every frame by reversing the fitted overlay. Checked at 0.5/2/4/7/9.9 s on light marble and across the moving shadow. The audio track was dropped (2.0 MB).
- **Watched at 1440×900 and 390×844:**
  - Desktop: the video fills the window, then lines trace the real cups, the pour splits, ½ draws, and the shutter lifts.
  - Mobile: the frame follows the stream left then right, then eases out to both cups for the drawing.
  - No console errors.
- **Tests:** 85 passed, 4 skipped (device-specific), two consecutive full runs. They cover viewport coverage, no controls, scroll lock, the exact state sequence (recorded in-page), once per session, the keyboard bypass, reduced motion, blocked autoplay and no-JS.
- **Bug found and fixed:** returning visitors' browsers began downloading the 2 MB video (hidden `<video preload="auto">`). It now preloads only when the opening will run.
- **Open:**
  - A first visit spends about 14 s on the opening, with no visible way past it (client's choice; keyboard keys still bypass it).
  - A future video needs new trace coordinates.

### Revision: coded opening animation (D11, 2026-10-15)
- **Client feedback:** the video did not match the theme, so replace it with an animation.
- **Built:** `IntroAnimation.astro`, three acts in the figure-plate language (filter drips → pour splits into two tumblers → ½) with captions. It runs about 5.3 s plus a 0.9 s lift, in the panel below the header.
- **Watched at 1440×900 and 390×844:** after review the drawing was enlarged (it filled about 25% of the panel) and the acts overlapped to remove an empty beat at about 2.6 s. A drop-position bug (a CSS transform overriding the SVG transform) was caught before shipping.
- **Tests:** 80 passed, 5 skipped (device-specific). They cover the in-page state log, the act checks (act 1 gone and both cups full by 4.7 s), the total under 7.5 s, once per session, the header click and keyboard bypass, reduced motion, no-JS and no controls.
- **Weight:** a first visit is back to about 0.4 MB, with no video.

### Revision: smooth and animated, highlighted drink cards (D14, 2026-10-15)
- **Built:**
  - Lenis smooth scroll.
  - The reveal system (variants, masks, shutter bands, stagger) and section choreography.
  - The moving header with scroll-spy and a progress line.
  - Drink cards as enamel menu plates: tilt, light, zoom, parallax, a mobile carousel, and card → board-row flash.
- **Watched at 1440 and 390:** wheel-scrolling through every section (mid-reveal and settled frames), the card hover, the mobile carousel, the header hide/show and indicator, and the card-click flash. With reduced motion, everything is visible and settled (photos load lazily on scroll).
- **Fixed during review:**
  - A 32 px horizontal overflow at 320 px caused by the side reveals.
  - Crema small labels on enamel failing contrast at 4.2:1 (now cream).
  - A wrong reveal attribute on the featured card.
  - A lint error.
- **Measured:** JS 8.6 KB gz in total, including Lenis. CLS < 0.1 through a full scroll (tested).
- **Tests:** 95 passed, 6 skipped (device-specific), two consecutive full runs.
- **Open:** scroll-driven extras (photo parallax, carousel scaling, progress line) need `animation-timeline` support. That means Chrome/Edge and Safari 26+; other browsers get the same page without those touches.
