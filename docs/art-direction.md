# Art direction

## The visual world

A 1950s Irani café, reopened in 2025 by people who care about coffee. White marble, brown enamel, steel tumblers, bentwood, morning light through a shopfront. The look is clean and well kept, not distressed. Think *inherited, maintained*, not *vintage-styled*.

## Phase 1 (now): figure plates

No photography exists yet (see D2). Imagery is a coherent set of **technical line drawings**, styled like figure plates in an old instruction manual.

| Rule | Spec |
|---|---|
| Line | 1.4 user units on a 240-unit plate (≈ 1.5–2 px rendered), round caps and joins. Ink on paper. Not `non-scaling-stroke`: the draw-in relies on `pathLength="1"` |
| Liquid | Solid decoction-brown fill on paper; crema over the hero video (D8) |
| Perspective | Strict elevation (side view) or plan (top view). No 3/4 views, no perspective, no shading |
| Detail | Only the parts that explain the object. Rims, seams, the umbrella-disc press. No textures |
| Annotation | Thin brown leader lines to small label text; "Fig. n" in vermilion label type |
| Scale | Objects drawn to approximate real proportion (tumbler ~ 8 cm tall, davara ~ 11 cm wide) |
| Movement | Only stroke draw-in, once (see motion.md). The floor plan never moves |

The drawing set is:
1. **Fig. 1, The filter:** a two-chamber South Indian coffee filter in elevation, with the umbrella press inside.
2. **Fig. 2, Eleven minutes:** the filter in section: water, grounds on the sieve, drops falling into a brown pool of decoction, and a dial with an 11/12 wedge.
3. **Fig. 3, From a height:** a tilted tumbler pouring a brown stream into the davara, with a dimension line marking the height.
4. **Fig. 4, By two:** one pour splitting (arrowed) into two tumbler-and-davara sets, with "₹60" under each in vermilion.
5. **The room:** a floor plan in plan view showing the shopfront, door swing, drip bar, counter, twelve marble tables for two and the brown long table. It is static.

The sign itself is typographic, not a drawing.

## Phase 1b: the opening animation (D11)
`IntroAnimation.astro` uses the figure-plate set at hero scale, with cream lines and crema liquid on espresso. Fig. 1's filter drips and fills, Fig. 3–4's pour splits into two tumblers that fill, and the ½ mark draws between them. It is strict elevation, like the plates.

## Phase 2: photography brief (live, D9)
The client supplies the photos and video. Drop-in locations and file specs are in `src/assets/drinks/README.md` and `src/assets/media/README.md`. The rules below keep the set one campaign.

When budget allows, one shoot covers the site. These rules keep it one campaign, not a stock collage.

- **Light:** daylight only, from the shopfront windows, mid-morning (09:30–11:00). No flash and no tungsten. Shadows stay soft but present.
- **Camera:** 35 mm or 50 mm equivalent at eye or table height. Straight-on verticals; no Dutch angles and no extreme top-down flat-lays.
- **Colour:** neutral-warm white balance. The sign's brown and the coffee must render true (shoot a colour checker against the sign). Grade lightly: lifted blacks, no orange-teal, no heavy vignette.
- **Grain:** natural, fine. No added film-dust overlays.
- **Subject balance:** 50% room and people, 30% ritual (pouring, tumblers, hands), 20% product. No floating cups on seamless backgrounds.
- **People:** regulars and staff as they are. Hands, profiles, two people sharing. Never models posing with cups at their lips.
- **Composition:** leave calm negative space on one side of horizontals so type can sit *beside* photos, not on them. Never put text over busy image areas.
- **Crops:** 4:5 for portrait slots, 3:2 for landscape. Supply each hero shot at both.
- **Must-get list:** the sign from across the lane · the pour from height (fast shutter) · two tumblers on marble, overhead at 60° · the long table full of people · a Sunday morning with books on a table · the drip bar row of filters · Zoya and Pranav at the counter, together.

### Where photos would go
- The families section: a portrait of the two founders together (4:5), beside the text.
- Visit: the sign from across the lane (3:2), above the address.
- The Board: no photo. The board is type.
- Hero: still the sign as HTML. A photo never replaces it.

## Typography and imagery

Type and drawings never overlap. Drawings sit in their own grid cells with a caption below them, like plates in a manual. Display type can run to the plate edges; drawings always have breathing room.
