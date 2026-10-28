import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { readEnv } from './src/domain/env.ts';

export default defineConfig({
  site: readEnv(process.env).siteUrl,
  output: 'static',
  build: { inlineStylesheets: 'always' },
  i18n: {
    locales: ['en', 'uk'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  // No asset is inlined as a data: URI, so the CSP needs no data: source for fonts.
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
});
