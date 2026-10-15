import { type Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { board } from '../src/data/menu';
import { rules } from '../src/data/rules';

// Wednesday 10:00 IST. The browser runs in New York on purpose: status must still be computed in IST.
const WED_10_IST = new Date('2026-10-07T10:00:00+05:30');
test.use({ timezoneId: 'America/New_York' });

async function open(page: Page, at = WED_10_IST) {
  await page.clock.setFixedTime(at);
  await page.goto('/');
}

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 760;

test.describe('first viewport', () => {
  test('AC-1: name, directions and board link are visible without scrolling', async ({ page }) => {
    await open(page);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      // Chrome inserts a separator between flex items; what matters is the words are not run together.
      /^One by Two\s?, coffee house in Hyderabad$/,
    );
    const vh = page.viewportSize()!.height;
    for (const link of [
      page.locator('#top').getByRole('link', { name: /Get directions/ }),
      page.locator('#top').getByRole('link', { name: 'See the board' }),
    ]) {
      await expect(link).toBeVisible();
      const box = (await link.boundingBox())!;
      expect(box.y + box.height).toBeLessThanOrEqual(vh);
    }
  });

  test('AC-2: live status uses IST even when the browser is in another zone', async ({ page }) => {
    await open(page);
    await expect(page.locator('#top [data-status]')).toHaveText('Open now · until 10 pm');
    await expect(page.locator('#top [data-status]')).toHaveAttribute('data-state', 'open');
  });

  test('AC-2: Monday noon IST reads closed until Tuesday', async ({ page }) => {
    await open(page, new Date('2026-10-05T12:00:00+05:30'));
    await expect(page.locator('#top [data-status]')).toHaveText('Closed · opens Tuesday 8 am');
  });

  test('AC-17: the sign name is large, ≤ 3 lines, and stays inside the plate', async ({ page }) => {
    await open(page);
    const name = page.locator('.sign__name');
    const fontSize = await name.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(56);
    const nameBox = (await name.boundingBox())!;
    const plate = (await page.locator('.sign').boundingBox())!;
    expect(nameBox.x).toBeGreaterThanOrEqual(plate.x);
    expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(plate.x + plate.width);
    const words = await page.locator('.sign__word').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    expect(new Set(words.map((t) => Math.round(t / 20))).size).toBeLessThanOrEqual(3);
  });
});

test.describe('no-JS fallback', () => {
  test.use({ javaScriptEnabled: false });
  test('AC-3: status shows static weekly hours, never empty', async ({ page }) => {
    await page.goto('/');
    const status = page.locator('#top [data-status]');
    await expect(status).toContainText('Tue–Sat 8 am – 10 pm');
    await expect(page.locator('.reveal').first()).toBeVisible();
  });
});

test.describe('navigation', () => {
  test('AC-4: a nav link lands its heading below the sticky header', async ({ page }) => {
    await open(page);
    if (isMobile(page)) await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'The board' }).click();
    await expect(page).toHaveURL(/#board$/);
    const heading = page.locator('#board-title');
    await expect(heading).toBeInViewport();
    const header = (await page.locator('[data-header]').boundingBox())!;
    await expect
      .poll(async () => (await heading.boundingBox())!.y)
      .toBeGreaterThanOrEqual(header.y + header.height - 1);
  });

  test('AC-4: mobile menu toggles, closes on Escape and returns focus', async ({ page }) => {
    test.skip(!isMobile(page), 'mobile only');
    await open(page);
    const toggle = page.locator('[data-nav-toggle]');
    const list = page.locator('[data-nav-list]');
    await expect(list).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(list).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(list).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});

test.describe('content', () => {
  test('AC-5: four ritual figures with labelled drawings and the price', async ({ page }) => {
    await open(page);
    const figures = page.locator('#by-two figure');
    await expect(figures).toHaveCount(4);
    for (const fig of await figures.all()) {
      await expect(fig.locator('svg[role="img"]')).toHaveCount(1);
      await expect(fig.locator('svg[role="img"] title')).not.toBeEmpty();
      await expect(fig.locator('figcaption')).not.toBeEmpty();
    }
    await expect(page.locator('#by-two')).toContainText('₹120');
  });

  test('AC-6: every menu item is on the board with a rupee price', async ({ page }) => {
    await open(page);
    const expected = board.reduce((n, s) => n + s.items.length, 0);
    await expect(page.locator('[data-menu-item]')).toHaveCount(expected);
    const prices = await page.locator('.item__price').allTextContents();
    expect(prices.every((p) => /^₹\d+$/.test(p.trim()))).toBe(true);
  });

  test('AC-7: all house rules render as an ordered list', async ({ page }) => {
    await open(page);
    await expect(page.locator('#rules ol > li')).toHaveCount(rules.length);
  });

  test('AC-8: hours table has 7 rows and marks today (IST) only', async ({ page }) => {
    await open(page);
    await expect(page.locator('[data-hours] tbody tr')).toHaveCount(7);
    const current = page.locator('[data-hours] tr[aria-current="date"]');
    await expect(current).toHaveCount(1);
    await expect(current).toContainText('Wednesday');
    await expect(current).toContainText('Today');
  });

  test('AC-11: footer carries address, phone and email links', async ({ page }) => {
    await open(page);
    const footer = page.locator('footer');
    await expect(footer).toContainText('Hyderabad');
    await expect(footer.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(footer.locator('a[href^="mailto:"]')).toHaveCount(1);
  });
});

test.describe('long-table form', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Capture instead of opening WhatsApp.
      window.open = ((url: string) => {
        (window as unknown as { __opened: string[] }).__opened = [
          ...((window as unknown as { __opened?: string[] }).__opened ?? []),
          url,
        ];
        return null;
      }) as typeof window.open;
    });
    await open(page);
  });

  test('AC-9: empty submit shows linked errors, focuses first field, opens nothing', async ({ page }) => {
    await page.getByRole('button', { name: 'Request on WhatsApp' }).click();
    await expect(page.locator('#bk-name')).toBeFocused();
    for (const id of ['name', 'date', 'time', 'size']) {
      const err = page.locator(`#bk-${id}-err`);
      await expect(err).toBeVisible();
      await expect(page.locator(`#bk-${id}`)).toHaveAttribute('aria-invalid', 'true');
      expect(await page.locator(`#bk-${id}`).getAttribute('aria-describedby')).toContain(`bk-${id}-err`);
    }
    expect(await page.evaluate(() => (window as unknown as { __opened?: string[] }).__opened)).toBeUndefined();
  });

  test('AC-10: party size below 6 is refused with a reason', async ({ page }) => {
    await page.locator('#bk-size').fill('4');
    await page.getByRole('button', { name: 'Request on WhatsApp' }).click();
    await expect(page.locator('#bk-size-err')).toContainText('walk in');
  });

  test('AC-9: a valid request opens a pre-filled wa.me message', async ({ page }) => {
    await page.locator('#bk-name').fill('Asha Rao');
    await page.locator('#bk-date').fill('2026-10-11');
    await page.locator('#bk-time').selectOption('09:30');
    await page.locator('#bk-size').fill('8');
    await page.getByRole('button', { name: 'Request on WhatsApp' }).click();
    const opened = await page.evaluate(() => (window as unknown as { __opened?: string[] }).__opened ?? []);
    expect(opened).toHaveLength(1);
    const url = new URL(opened[0]);
    expect(url.host).toBe('wa.me');
    const text = url.searchParams.get('text') ?? '';
    for (const part of ['Asha Rao', 'Sunday 11 October 2026', '9:30 am', 'People: 8']) expect(text).toContain(part);
    await expect(page.locator('[data-booking-status]')).toContainText('WhatsApp');
  });
});

test.describe('layout & semantics', () => {
  test('AC-15: no horizontal scroll from 320 to 1920 px', async ({ page }) => {
    test.skip(isMobile(page), 'widths are set explicitly; run once');
    await open(page);
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test('AC-16: tap targets are at least 44×44 on mobile', async ({ page }) => {
    test.skip(!isMobile(page), 'mobile only');
    await open(page);
    await page.locator('[data-nav-toggle]').click();
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('a, button, input, select, textarea')]
        .filter((el) => !el.closest('p') && el.offsetParent !== null && !el.classList.contains('skip-link'))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { el: el.outerHTML.slice(0, 70), w: Math.round(r.width), h: Math.round(r.height) };
        })
        .filter((r) => r.w < 44 || r.h < 44),
    );
    expect(small).toEqual([]);
  });

  test('AC-14: every keyboard focus ring is visible (≥ 3:1 against the ground it is drawn on)', async ({ page }) => {
    await open(page);
    const seen = new Set<string>();
    const failures: string[] = [];
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
        const lum = ([r, g, b]: number[]) => {
          const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        // The ring sits outside the element: measure against the nearest opaque ancestor background.
        let node = el.parentElement;
        let bg = [255, 255, 255];
        while (node) {
          const c = parse(getComputedStyle(node).backgroundColor);
          if (c.length >= 3 && (c.length === 3 || c[3] > 0.5)) {
            bg = c.slice(0, 3);
            break;
          }
          node = node.parentElement;
        }
        const ring = parse(cs.outlineColor).slice(0, 3);
        const [a, b] = [lum(ring), lum(bg)].sort((x, y) => y - x);
        return {
          key: el.outerHTML.slice(0, 80),
          style: cs.outlineStyle,
          width: parseFloat(cs.outlineWidth),
          ratio: (a + 0.05) / (b + 0.05),
        };
      });
      if (!r || seen.has(r.key)) continue;
      seen.add(r.key);
      if (r.style === 'none' || r.width < 2 || r.ratio < 3) failures.push(`${r.key} → ${r.style} ${r.width}px ${r.ratio.toFixed(2)}:1`);
    }
    expect(seen.size).toBeGreaterThan(10);
    expect(failures).toEqual([]);
  });

  test('AC-20: one h1, no skipped heading levels, landmarks, skip link first', async ({ page }) => {
    await open(page);
    const levels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    levels.forEach((l, i) => i > 0 && expect(l - levels[i - 1]).toBeLessThanOrEqual(1));
    for (const role of ['banner', 'main', 'contentinfo'] as const) await expect(page.getByRole(role)).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(1);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
  });

  test('AC-25 / AC-24: no console errors, failed or third-party requests', async ({ page }) => {
    const problems: string[] = [];
    page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`failed: ${r.url()}`));
    page.on('request', (r) => !r.url().startsWith('http://localhost:4322') && problems.push(`third-party: ${r.url()}`));
    await open(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState('networkidle');
    expect(problems).toEqual([]);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('AC-21: content and drawings are fully visible with no animation', async ({ page }) => {
    await open(page);
    const hidden = await page.locator('.reveal').evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
    expect(hidden).toBe(0);
    const offsets = await page
      .locator('.plate__art .ln > *')
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).strokeDasharray));
    expect(offsets.every((d) => d === 'none')).toBe(true);
  });
});
