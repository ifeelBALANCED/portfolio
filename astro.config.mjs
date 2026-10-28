import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://vladyslav-herasymenko.vercel.app',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
