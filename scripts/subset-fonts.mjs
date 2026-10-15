// Builds two tiny subset faces (D7) into src/assets/fonts/. Variable axes are kept.
// Re-run after changing the sign's Telugu text:  node scripts/subset-fonts.mjs
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync } from 'node:fs';

const FONTS = 'node_modules/@fontsource-variable';
const jobs = [
  {
    // Telugu on the sign only. Keep in sync with src/components/Sign.astro.
    src: `${FONTS}/anek-telugu/files/anek-telugu-telugu-wght-normal.woff2`,
    text: 'కాఫీచాయ్',
    out: 'src/assets/fonts/anek-telugu-sign.woff2',
  },
  {
    // The rupee sign, so Anek's 80 KB latin-ext file is never needed.
    src: `${FONTS}/anek-latin/files/anek-latin-latin-ext-wdth-normal.woff2`,
    text: '₹',
    out: 'src/assets/fonts/anek-rupee.woff2',
  },
];

for (const job of jobs) {
  const input = readFileSync(job.src);
  const output = await subsetFont(input, job.text, { targetFormat: 'woff2' });
  writeFileSync(job.out, output);
  console.log(`${job.out}: ${input.length} → ${output.length} bytes`);
}
