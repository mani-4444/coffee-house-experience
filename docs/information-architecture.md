# Information architecture

One page. It reads like walking into the café, not like a brochure.

**Narrative arc:** intrigue → discovery → desire → personality → trust → action

| # | Anchor | Section | Beat | Surface | Job |
|---|---|---|---|---|---|
| 0 | — | Header bar | — | paper, sticky | Wordmark, 4 links, **Directions** button. Always one tap from leaving for the café. |
| — | — | **Opening** (first visit) | Intrigue | window below the header | Coded animation: filter → pour by two → ½, then the shutter lifts (D11). |
| 1 | `#top` | **The Sign** | Intrigue | **brown plate** | The shopfront enamel sign *is* the hero and settles as the opening lifts. H1 = café name. Below it on paper: one-line premise, live open-now line, CTAs (Directions / See the board). |
| 2 | `#by-two` | **Kaapi, by two** | Discovery | paper | Explains the signature ritual in four numbered figures (line drawings). Price anchor: ₹120 for two cups. |
| 2b | `#cups` | **In the cups** | Desire | paper | One 4:5 photo per drink supplied, in board order. Exists only once photos exist (D9). |
| 3 | `#board` | **The Board** | Desire | **ink plate** | The menu as the wall board. Three columns: Kaapi / Chai / Bakery. "On the pour-over today" callout. |
| 4 | `#rules` | **House Rules** | Personality | **brown plate** | Eight numbered rules. The memorable centrepiece. Quoted by regulars. |
| 5 | `#families` | **Two trades, one counter** | Trust | paper (marble-deep) | The two families and the two origins, set either side of the ½ slash. Sourcing facts. |
| 6 | `#visit` | **Find the brown sign** | Action | paper | City + landmark line, hours (today highlighted, live status), Directions, floor plan of the room, long-table request form. |
| 7 | — | Footer | — | ink | Name, address, hours summary, contact, Instagram. Small print: fictional-brand notice is NOT shown (it's a client comp; noted in PROJECT.md). |

## Why this order

- **The sign first, not a food photo:** the first thing you see of any café is its sign. It gives the name, the place and a personality in one image, and it can't be mistaken for another café.
- **The ritual before the menu:** a menu is a list until you know what to order. Section 2 tells you, so Section 3 feels like recognition.
- **Rules in the middle:** momentum dips after the menu on most café sites. The rules are the most quotable content and keep the scroll going.
- **Families just before Visit:** trust is the last thing needed before action. "Who's behind it and where does the coffee come from" answers it.
- **Visit holds everything practical:** address, hours, directions and booking sit in one place, so returning visitors can deep-link to `#visit`.

## Navigation

- Links: **Kaapi by two** · **The board** · **House rules** · **Visit**. A **Directions** button opens Google Maps in a new tab.
- Mobile: wordmark + **Directions** + **Menu** toggle that reveals the four links.
- The families section isn't in the nav. It's narrative, not a destination.

## Content inventory (source of truth: `src/data/`)

- `site.ts`: name, city, landmark, phone/WhatsApp, email, Instagram, maps URL, hours.
- `menu.ts`: board sections → items (name, note, price, optional "by two" price, flags).
- `rules.ts`: the eight house rules.
- Copy that belongs to a single section lives in that section's component.
