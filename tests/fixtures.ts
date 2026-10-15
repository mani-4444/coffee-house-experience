import { test as base, expect } from '@playwright/test';

/**
 * Page tests load the site without the opening (which otherwise plays on every load, D13), so it does
 * not cover what they check. The opening itself is tested in media.spec.ts with the plain `test`.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem('obt:intro-off', '1');
      } catch {
        /* storage blocked */
      }
    });
    await use(page);
  },
});

export { expect };
