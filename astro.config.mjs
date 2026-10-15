// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH are set by `npm run deploy` for GitHub Pages
// (https://mani-4444.github.io/coffee-house-experience/). Local dev, tests and screenshots use the root.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://onebytwo.coffee',
  base: process.env.BASE_PATH ?? '/',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
