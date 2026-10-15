# Design system

Only the decisions this site needs. The source of truth for values is `src/styles/tokens.css`. This file explains the *rules* for using them.

## Principle

Everything on the page is an object you would find in the café: **the sign, the board, the rules, the figure plate, the floor plan**. When designing something new, ask *what object in the room is this?* If there isn't one, it probably sits on plain paper with type alone.

## Colour

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F3EBDD` | Page ground (milk cream) |
| `--paper-deep` | `#E9DCC8` | Secondary ground (families section, form fields) |
| `--ink` | `#1E1410` | Espresso: text, the board plate, footer, video stage |
| `--ink-soft` | `#5A4A3E` | Secondary text on paper |
| `--rule-line` | `#D3C2A8` | Hairlines and dotted leaders on paper (decorative, never text) |
| `--enamel` | `#4A2C1D` | **The** brand colour, decoction brown: sign and rules plates, primary button, links, drawn liquid |
| `--enamel-deep` | `#36200F` | Hover/pressed for enamel |
| `--cream` | `#F7EFE2` | Text and rims on enamel and ink |
| `--cream-muted` | `#BDAE9B` | Secondary text on ink |
| `--enamel-soft` | `#D9BFA0` | Secondary text on enamel |
| `--crema` | `#C08A4A` | Caramel accent: text **only on ink/enamel**; on paper decorative only (2.5:1) |
| `--scrim` | espresso 55% | Veil over the hero video/poster once the intro ends |
| `--vermilion` | `#A83223` | Sign-writer accent on paper (figure numbers, today marker) |
| `--vermilion-light` | `#E86A50` | Accent on ink/enamel. **Large text only (≥ 24 px)** on enamel |

### Contrast (WCAG 2.1, computed)
ink/paper 15.3 · ink/paper-deep 13.4 · ink-soft/paper 7.1 · ink-soft/paper-deep 6.3 · enamel/paper 10.6 · enamel/paper-deep 9.3 · cream/enamel 11.0 · cream/ink 15.8 · cream-muted/ink 8.3 · enamel-soft/enamel 7.1 · crema/ink 6.0 · crema/enamel 4.2 · crema/paper **2.5 (decorative only)** · vermilion/paper 5.6 · vermilion/paper-deep 4.9 · vermilion-light/ink 5.7 · vermilion-light/enamel **4.0 (large only)**.

### Rules
- Decoction brown (`--enamel`) is the brand colour (D8). Crema is its accent on dark grounds. Never gradient either.
- Vermilion covers less than 2% of any screen. It marks *numbers and "now"*, never decoration.
- No pure white and no pure black.

## Typography

| Role | Family | Settings |
|---|---|---|
| Signage (sign, plate headings, section titles) | Anek Latin | `wdth` 75, `wght` 700–800, uppercase, `letter-spacing` 0.01em |
| Label (eyebrows, nav, buttons, table heads) | Anek Latin | `wdth` 100, `wght` 600, uppercase, 0.08em tracking, 0.8125–0.875rem |
| Voice (body, ledes, captions, menu notes) | Newsreader | `opsz` auto, 400; italic for asides |
| Telugu (sign only) | Anek Telugu Sign (10 KB subset, D7) | `wght` 600 |

### Scale (fluid)
| Token | Value | Use |
|---|---|---|
| `--step-sign` | `clamp(3.5rem, 17vw, 13rem)` | Sign name only |
| `--step-6` | `clamp(3rem, 8vw, 7rem)` | Section titles on plates |
| `--step-5` | `clamp(2.4rem, 5.5vw, 4.5rem)` | Section titles on paper |
| `--step-4` | `clamp(1.75rem, 3vw, 2.5rem)` | Sub-titles, rule text on desktop |
| `--step-3` | `clamp(1.375rem, 2vw, 1.75rem)` | Ledes |
| `--step-2` | `1.25rem` | Menu item names |
| `--step-1` | `1.125rem` | Body (18 px) |
| `--step-0` | `1rem` | Captions, small print |
| `--step--1` | `0.8125rem` | Labels |

- Body line-height is 1.55, measure ≤ 62ch. Display line-height is 0.88–0.95.
- Prices use `font-variant-numeric: tabular-nums lining-nums`.
- Use `text-wrap: balance` on headings and `pretty` on paragraphs.

## Space & grid

- Spacing scale: `--s-1` 0.25rem → `--s-10` 10rem, with 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 160 px stops.
- Section vertical padding is `--section-y: clamp(5rem, 12vw, 10rem)`.
- Container is `min(100% - 2 * var(--gutter), 1360px)`, with `--gutter: clamp(1rem, 4vw, 3rem)`.
- Grid: 12 columns, `--gap: clamp(1rem, 2.5vw, 2rem)`. Collapses to a single column under 760 px.
- Breakpoints: **760 px** (layouts go single-column, the sign stacks), **900 px** (nav collapses to Menu) and **1100 px** (wide compositions). Content-driven `clamp()` handles everything else.

## Surfaces

| Surface | Background | Radius | Border |
|---|---|---|---|
| Paper | `--paper` | 0 | — |
| Enamel plate (sign, rules) | `--enamel` | `--radius-enamel: clamp(14px, 2vw, 28px)` | Inset 2 px `--cream` rim at `--rim-inset` |
| Board plate | `--ink` | 0 | — |
| Form field | `--paper-deep` | 0 | 1.5 px `--ink` bottom border |

No shadows anywhere. Depth comes from colour blocks and hairlines.

## Components

- **Button, primary:** enamel ground, cream label type, 48 px min height, 0 radius, 1.25rem horizontal padding. Hover: `--enamel-deep`. On enamel/ink grounds it inverts to a cream ground with enamel text.
- **Button, text link:** label type with a 1.5 px underline offset 0.3em; the underline thickens on hover.
- **Nav:** label type, 44 px tap height, current section underlined (when known).
- **Board row:** name ··· dotted leader ··· price. Note on the next line in italic Newsreader. Hover/focus-within: `--vermilion-light` price, a faint cream 6% row background.
- **Figure:** SVG drawing, then a "Fig. n" label in vermilion, then the caption. Line drawings use a 1.5 px stroke (non-scaling), ink on paper, with cobalt for liquid and annotation leader lines.
- **Rule item:** a large numeral (vermilion-light, display type) and rule text (cream, Newsreader, `--step-4`). Separated by a cream 25% hairline.
- **Hours table:** day, hours. Today's row gets a vermilion "Today" marker and bold text. It is not colour alone: it also says "Today".
- **Status line:** dot + text. The dot is enamel when open and ink-soft when closed. The words always say open/closed.

## Global utilities (`src/styles/global.css`)
`.container`, `.sign-type`, `.label`, `.lede`, `.btn` / `.btn--invert`, `.text-link`, `.visually-hidden`, `.reveal`, and the `.drawing` line system. Anything else is component-scoped.

## Focus & states

- Focus ring: `outline: 2px solid currentColor; outline-offset: 3px`. The ring takes its colour from context: enamel on paper, cream on enamel and ink. `.btn` overrides it to enamel, because the ring is drawn over paper, not over the button. Enforced by the AC-14 test (≥ 3:1 for every tab stop).
- Errors: vermilion text with an ✕ glyph prefix and `aria-describedby`. The field's bottom border turns vermilion.
- Disabled is not used. The form validates on submit.

## Don'ts

No shadows, no decorative gradients, no pill buttons, no icon sets, no emoji. **Cards only for drinks** (D14), built as enamel menu plates: an `--enamel` ground, an inset cream rim (`--rim-inset`, `--radius-enamel`) and a photo inset in the rim. Crema on the rim for hover/focus. Radius only on the two enamel plates. No centred-everything sections. Never put two sections with the same composition back to back.
