// Visual QA: screenshots of the built site at representative widths → qa/shots/
// Usage: npm run build && npm run shots [-- --only=390]
import { chromium } from '@playwright/test';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const PORT = 4323;
const WIDTHS = [
  { name: 'small', width: 320, height: 640 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
const out = 'qa/shots';
mkdirSync(out, { recursive: true });

const server = spawn('npx astro preview --force --port ' + PORT, { shell: true, stdio: 'ignore' });
const url = `http://localhost:${PORT}/`;
for (let i = 0; i < 60; i++) {
  try { if ((await fetch(url)).ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const vp of WIDTHS) {
    if (only && String(vp.width) !== only) continue;
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, timezoneId: 'Asia/Kolkata' });
    // Full-page shots show the settled hero; the intro is reviewed separately.
    await page.addInitScript(() => sessionStorage.setItem('obt:intro-off', '1'));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Reveal everything so full-page shots show final state.
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${out}/${vp.width}-fold.png` });
    await page.screenshot({ path: `${out}/${vp.width}-full.png`, fullPage: true });
    console.log(`${vp.name} ${vp.width}px ✓`);
    await page.close();
  }
} finally {
  await browser.close();
  // Astro allows one preview server per project; stop it so tests and later runs can start their own.
  spawnSync('npx astro preview stop', { shell: true, stdio: 'ignore' });
  server.kill();
}
