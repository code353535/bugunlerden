import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  prefetch: {
    defaultStrategy: 'viewport'
  },
  image: {
    domains: ["astro.build"],
  },
  site: 'https://bugunlerde.com',
  integrations: [vue(), tailwind(), icon(), sitemap()],
  build: {
    output: 'static',
  },
});