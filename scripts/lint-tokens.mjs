// AC-12: colours come from src/styles/tokens.css only. Fails on raw hex colours anywhere else in src/.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ALLOW = new Set(['src/styles/tokens.css', 'src/layouts/Base.astro']); // Base: <meta theme-color> needs a literal
const EXT = /\.(astro|css|ts|js|mjs)$/;
// A hex colour: # + 3/4/6/8 hex digits, not part of a word or an HTML entity.
const HEX = /(?<![\w&/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
// …unless it is a fragment link or id reference, e.g. href="#add".
const REF = /(href|aria-controls|aria-describedby|aria-labelledby)=["'{`][^"'`]*$/;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.test(p)) files.push(p);
  }
};
walk('src');

let failures = 0;
for (const file of files) {
  const rel = relative('.', file).split(sep).join('/');
  if (ALLOW.has(rel)) continue;
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const m of line.matchAll(HEX)) {
        if (REF.test(line.slice(0, m.index))) continue;
        console.error(`${rel}:${i + 1}  raw colour ${m[0]}: use a token from src/styles/tokens.css`);
        failures++;
      }
    });
}
if (failures) process.exit(1);
console.log(`lint:tokens: ${files.length} files clean`);
