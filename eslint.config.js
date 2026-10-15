import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'qa/', 'test-results/', '.agents/'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    // role="list" is intentional: Safari/VoiceOver drops list semantics when list-style is none.
    rules: { 'astro/jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }] },
  },
];
