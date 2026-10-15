import { test, expect, type Page } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import { board } from '../src/data/menu';

// The opening (D11) and the drink photography (D9). Uses the plain `test`: a first visit, opening included.
const menuIds = new Set(board.flatMap((s) => s.items.map((i) => i.id)));
const photoIds = existsSync('src/assets/drinks')
  ? readdirSync('src/assets/drinks')
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => f.replace(/\.[^.]+$/, ''))
      .filter((id) => menuIds.has(id))
  : [];

const intro = (page: Page) => page.evaluate(() => document.documentElement.dataset.intro ?? 'done');
const layer = (page: Page) => page.locator('[data-intro-layer]');
const done = async (page: Page, timeout = 12_000) =>
  expect.poll(() => intro(page), { timeout, intervals: [200] }).toBe('done');

test.describe('opening animation (AC-26, AC-27)', () => {
  test('first visit: fills the window below the header with no controls, then the site arrives', async ({ page }) => {
    await page.goto('/');
    expect(await intro(page)).toBe('animating');
    const vp = page.viewportSize()!;
    const header = (await page.locator('[data-header]').boundingBox())!;
    const box = (await layer(page).boundingBox())!;
    expect([Math.round(box.x), Math.round(box.y), Math.round(box.width), Math.round(box.y + box.height)]).toEqual([
      0,
      Math.round(header.y + header.height),
      vp.width,
      vp.height,
    ]);
    await expect(page.locator('[data-header] .wordmark')).toBeVisible();
    await expect(layer(page).locator('button, a, video, [controls]')).toHaveCount(0);
    // Scroll is locked: our own rule (hidden) or Lenis's paused state (clip), whichever wins.
    expect(['hidden', 'clip']).toContain(await page.evaluate(() => getComputedStyle(document.documentElement).overflow));

    await done(page);
    await expect(layer(page)).toBeHidden();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('visible');
    await expect(page.locator('.sign')).toHaveCSS('opacity', '1');
    const cta = (await page.locator('#top').getByRole('link', { name: /Get directions/ }).boundingBox())!;
    expect(cta.y + cta.height).toBeLessThanOrEqual(vp.height);
  });

  test('runs pending → animating → lifting → done with all three acts, in about six seconds', async ({ page }) => {
    // Record state changes in the page: polling from outside can step over the 0.9 s lift.
    await page.addInitScript(() => {
      const log: [string, number][] = ((window as unknown as { __introLog: [string, number][] }).__introLog = []);
      new MutationObserver(() => {
        const s = document.documentElement.dataset.intro ?? 'done';
        if (log.at(-1)?.[0] !== s) log.push([s, Math.round(performance.now())]);
      }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-intro'] });
    });
    await page.goto('/');
    // By act 3 the filter has gone, both tumblers are full and the ½ is drawing.
    await page.waitForTimeout(4700);
    const act1 = await page.locator('.act--1').evaluate((g) => Number(getComputedStyle(g).opacity));
    const fills = await page.locator('.act--2 .fill').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(act1).toBeLessThan(0.05);
    expect(fills).toEqual(['1', '1']);
    await done(page);
    const log = await page.evaluate(() => (window as unknown as { __introLog: [string, number][] }).__introLog);
    expect(log.map(([s]) => s)).toEqual(['pending', 'animating', 'lifting', 'done']);
    const total = log.at(-1)![1] - log[1][1];
    expect(total).toBeGreaterThan(5_500);
    expect(total).toBeLessThan(7_500);
  });

  test('it plays again on every reload (D13)', async ({ page }) => {
    await page.goto('/');
    expect(await intro(page)).toBe('animating');
    await page.keyboard.press('Escape');
    await done(page, 3_000);
    await page.reload();
    expect(await intro(page)).toBe('animating');
    await expect(layer(page)).toBeVisible();
  });

  test('the header stays usable: a nav click ends the opening and lands on the section', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 900, 'desktop nav');
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'The board' }).click();
    await done(page, 2_000);
    await expect(page.locator('#board-title')).toBeInViewport();
  });

  test('keyboard users are never held behind it: Tab brings the site straight up', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await done(page, 3_000);
  });

  test.describe('reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });
    test('never shows the opening', async ({ page }) => {
      await page.goto('/');
      expect(await intro(page)).toBe('done');
      await expect(layer(page)).toBeHidden();
      await expect(page.locator('.sign')).toHaveCSS('opacity', '1');
    });
  });

  test('no JS: no opening, the sign is simply there', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('[data-intro-layer]')).toBeHidden();
    await expect(page.locator('.sign')).toBeVisible();
    await ctx.close();
  });
});

test.describe('In the cups (AC-28)', () => {
  test('one photo per supplied drink, in board order, with alt text and responsive sources', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('obt:intro-off', '1'));
    await page.goto('/');
    const cups = page.locator('[data-cup]');
    if (!photoIds.length) {
      await expect(page.locator('#cups')).toHaveCount(0);
      await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'The cups' })).toHaveCount(0);
      return;
    }
    await expect(cups).toHaveCount(photoIds.length);
    const boardOrder = board.flatMap((s) => s.items.map((i) => i.id)).filter((id) => photoIds.includes(id));
    const names = await cups.locator('.cup__name').allInnerTexts();
    const expectedNames = boardOrder.map((id) => board.flatMap((s) => s.items).find((i) => i.id === id)!.name);
    expect(names.map((n) => n.toLowerCase())).toEqual(expectedNames.map((n) => n.toLowerCase()));
    for (const cup of await cups.all()) {
      const img = cup.locator('img');
      expect((await img.getAttribute('alt'))?.length ?? 0).toBeGreaterThan(5);
      await expect(cup.locator('source[type="image/avif"]')).toHaveAttribute('srcset', /\d+w/);
    }
    if (!(page.viewportSize()!.width < 900)) {
      await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'The cups' })).toBeVisible();
    }
  });
});
