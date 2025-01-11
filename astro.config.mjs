import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';


export default defineConfig({
  prefetch: {
    defaultStrategy: 'viewport'
  },

  image: {
    domains: ["astro.build"],
  },

  integrations: [vue(), tailwind(), icon(), sitemap(), partytown()],

  build: {
    output: 'static',
  },
 outDir: './temp'
 
});