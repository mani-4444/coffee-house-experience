import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

// Runs against dist/ (npm test builds first).
test('AC-23: shipped JS is ≤ 15 KB gzipped, with no framework runtime', () => {
  const dir = join('dist', '_astro');
  const js = readdirSync(dir).filter((f) => f.endsWith('.js'));
  const html = readFileSync(join('dist', 'index.html'), 'utf8');
  const inline = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('');
  const total = js.reduce((n, f) => n + gzipSync(readFileSync(join(dir, f))).length, 0) + gzipSync(inline).length;
  expect(total).toBeLessThanOrEqual(15 * 1024);
  expect(html).not.toMatch(/react|preact|vue|svelte/i);
});

test('AC-24: critical fonts are preloaded and self-hosted', () => {
  const html = readFileSync(join('dist', 'index.html'), 'utf8');
  const preloads = [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)].map((m) => m[1]);
  expect(preloads).toHaveLength(2);
  expect(preloads.every((u) => u.startsWith('/_astro/'))).toBe(true);
  expect(html).not.toContain('fonts.googleapis.com');
});
