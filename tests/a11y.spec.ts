import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';

test('AC-18: zero axe violations (WCAG 2.1 A/AA), all content revealed', async ({ page }) => {
  await page.goto('/');
  // Reveal everything so contrast is measured on final states, not mid-fade.
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
  await page.waitForTimeout(1500);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  expect(summary).toEqual([]);
});

test('AC-18: zero axe violations with the mobile menu open', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 760, 'mobile only');
  await page.goto('/');
  await page.locator('[data-nav-toggle]').click();
  const results = await new AxeBuilder({ page }).include('header').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
