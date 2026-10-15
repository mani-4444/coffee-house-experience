# One by Two: Coffee House, Hyderabad

The website for **One by Two**, a (fictional) Hyderabad coffee house that serves South Indian filter coffee with Irani café manners. Order *kaapi by two*: one decoction, two tumblers, ₹120.

A single static page built with [Astro](https://astro.build). It ships no framework runtime and about 3.5 KB of gzipped JS. The total transfer is about 410 KB, most of it self-hosted variable fonts.

**Live:** https://mani-4444.github.io/coffee-house-experience/

## Run it

```sh
npm install
npm run dev        # http://localhost:4321
npm run verify     # typecheck, lint, token lint, build, unit + e2e + accessibility tests
npm run shots      # screenshots at 320 / 390 / 768 / 1440 → qa/shots/ (after a build)
npm run deploy     # build for GitHub Pages and publish to the gh-pages branch
```

Playwright uses the installed Google Chrome (`channel: 'chrome'`), so there is no browser download.

## Where things are

| Path | What |
|---|---|
| `src/data/` | All content: contact details, hours, menu, house rules. **Fictional, replace before launch.** |
| `src/lib/` | Pure logic: open-now status (IST), long-table booking rules |
| `src/components/` | One component per page section, plus figure drawings |
| `src/styles/tokens.css` | The only place colours, type and spacing values live |
| `tests/` | Unit (`hours`, `booking`, `build`), e2e (`site`), accessibility (`a11y`) |

## Documentation

- [PROJECT.md](PROJECT.md): brand, audience, goals
- [SPEC.md](SPEC.md): requirements and acceptance criteria
- [docs/decisions.md](docs/decisions.md): creative direction and architecture decisions
- [docs/design-system.md](docs/design-system.md), [docs/art-direction.md](docs/art-direction.md), [docs/motion.md](docs/motion.md), [docs/information-architecture.md](docs/information-architecture.md)
- [docs/evaluation.md](docs/evaluation.md): final audit and open issues
- [CLAUDE.md](CLAUDE.md) and [agent.md](agent.md): rules for working on this repo
