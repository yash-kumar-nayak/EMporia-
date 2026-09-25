// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// Until a custom domain is connected the site lives at
// https://yash-kumar-nayak.github.io/EMporia-/
// When a domain is added: set SITE to it, BASE to '/', and add public/CNAME.
const SITE = 'https://yash-kumar-nayak.github.io';
const BASE = '/EMporia-';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  // Sample (placeholder) case studies stay out of the sitemap; they are also marked noindex.
  integrations: [sitemap({ filter: (page) => !page.includes('/case-studies/sample-') }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});