import { type Page } from '@playwright/test';
import { test, expect } from './fixtures';

// D14: smooth scrolling, the moving header, the highlighted drink cards and reveal integrity.
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 760;
const scrollToY = async (page: Page, y: number) => {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(450);
};

test.describe('header (AC-29)', () => {
  test('steps aside while reading down, returns on scroll up and when focused', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('[data-header]');
    await scrollToY(page, 900);
    await scrollToY(page, 1600);
    await expect(header).toHaveAttribute('data-hidden', 'true');
    await scrollToY(page, 1300);
    await expect(header).toHaveAttribute('data-hidden', 'false');
    await scrollToY(page, 2200);
    await expect(header).toHaveAttribute('data-hidden', 'true');
    await page.locator('[data-header] .wordmark').focus();
    await expect(header).toHaveAttribute('data-hidden', 'false');
  });

  test('scroll-spy marks the section in view and slides the underline to it', async ({ page }) => {
    test.skip(isMobile(page), 'desktop nav');
    await page.goto('/');
    await page.evaluate(() => {
      const board = document.getElementById('board')!;
      window.scrollTo(0, board.getBoundingClientRect().top + scrollY - 100);
    });
    const link = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'The board' });
    await expect(link).toHaveAttribute('aria-current', 'true');
    const indicator = page.locator('[data-nav-indicator]');
    await expect(indicator).toHaveAttribute('data-on', 'true');
    const [lx, ix] = [(await link.boundingBox())!.x, (await indicator.boundingBox())!.x];
    await expect.poll(async () => Math.abs((await indicator.boundingBox())!.x - lx)).toBeLessThan(2);
    expect(Math.abs(ix - lx)).toBeLessThan(400);
    await expect(page.locator('[aria-current="true"]')).toHaveCount(1);
  });
});

test.describe('drink cards (AC-30)', () => {
  test('the house order leads, and every card links to a real board row', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-cup]');
    test.skip((await cards.count()) === 0, 'no drink photos supplied');
    await expect(page.locator('.cup--feature')).toHaveCount(1);
    await expect(page.locator('.cup--feature')).toContainText('The house order');
    for (const href of await cards.evaluateAll((els) => els.map((e) => e.getAttribute('href')))) {
      expect(href).toMatch(/^#item-/);
      await expect(page.locator(href!)).toHaveCount(1);
    }
  });

  test('a card takes you to its row on the board, which flashes', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.cups__grid [data-cup]').first();
    test.skip((await card.count()) === 0, 'no drink photos supplied');
    const href = (await card.getAttribute('href'))!;
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    const row = page.locator(href);
    await expect(row).toBeInViewport();
    await expect(row).toHaveClass(/is-flash/);
  });

  test('desktop pointer tilts the card; touch never does', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.cups__grid [data-cup]').first();
    test.skip((await card.count()) === 0, 'no drink photos supplied');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const bb = (await card.boundingBox())!;
    await page.mouse.move(bb.x + 5, bb.y + 5);
    await page.mouse.move(bb.x + bb.width * 0.85, bb.y + bb.height * 0.2, { steps: 6 });
    await page.waitForTimeout(250);
    const rx = await card.evaluate((c) => (c as HTMLElement).style.getPropertyValue('--rx'));
    if (isMobile(page)) expect(rx).toBe('');
    else expect(parseFloat(rx)).toBeGreaterThan(1);
  });
});

test.describe('smooth scrolling (AC-31)', () => {
  test('is on with motion allowed (desktop wheel), and anchor links still update the URL', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(true);
    if (!isMobile(page)) {
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'House rules' }).click();
      await expect(page).toHaveURL(/#rules$/);
      await expect(page.locator('#rules-title')).toBeInViewport();
    }
  });

  test.describe('reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });
    test('is off: native scrolling, nothing hidden or displaced (AC-32)', async ({ page }) => {
      await page.goto('/');
      expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false);
      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('[data-reveal], .mask__inner, .item__leader, .rule__num, .blend__seg')]
          .filter((el) => {
            const cs = getComputedStyle(el);
            const t = cs.transform;
            const displaced = t !== 'none' && !/^matrix\(1, 0, 0, 1, 0, (-?[0-9.]+)\)$/.test(t);
            return Number(cs.opacity) < 1 || displaced || cs.clipPath.startsWith('inset(3%');
          })
          .map((el) => el.className.toString().slice(0, 40)),
      );
      expect(offenders).toEqual([]);
    });
  });
});

test('reveals never shift layout: CLS stays under 0.1 through a full scroll (AC-32)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(
    () =>
      new Promise<void>((done) => {
        const h = document.documentElement.scrollHeight;
        let y = 0;
        const step = () => {
          y += 500;
          window.scrollTo(0, y);
          if (y < h) setTimeout(step, 120);
          else setTimeout(done, 1500);
        };
        step();
      }),
  );
  const cls = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
            if (!e.hadRecentInput) total += e.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(total), 300);
      }),
  );
  expect(cls).toBeLessThan(0.1);
});
