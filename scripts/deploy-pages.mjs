// Build for GitHub Pages and publish dist/ to the `gh-pages` branch (served at the repo sub-path).
// Usage: npm run deploy
// Branch-based Pages needs no GitHub Actions workflow (and so no `workflow` token scope).
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const read = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

const remote = read('git remote get-url origin');
const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/);
if (!match) throw new Error(`origin is not a GitHub repo: ${remote}`);
const [, owner, repo] = match;
const site = `https://${owner.toLowerCase()}.github.io`;
const base = `/${repo}`;

console.log(`Building for ${site}${base}/ …`);
run('npx astro build', { env: { ...process.env, SITE_URL: site, BASE_PATH: base } });

// Without this, Pages runs Jekyll, which drops folders starting with "_" (Astro's _astro/ assets).
writeFileSync('dist/.nojekyll', '');

const source = read('git rev-parse --short HEAD');
const author = read('git config user.name');
const email = read('git config user.email');
const git = (args) => run(`git ${args}`, { cwd: 'dist' });
git('init -q -b gh-pages');
git(`-c user.name="${author}" -c user.email="${email}" add -A`);
git(`-c user.name="${author}" -c user.email="${email}" commit -q -m "Deploy ${source} to GitHub Pages"`);
git(`push -f "${remote}" gh-pages`);
console.log(`\nPublished to the gh-pages branch → ${site}${base}/`);
console.log('Note: dist/ now holds the Pages build; `npm test` rebuilds it for local use.');
