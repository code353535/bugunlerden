import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';


export default defineConfig({

  image: {
    domains: ["astro.build"],
  },
 site: 'https://bugunlerde.com',
  integrations: [vue(), tailwind(), icon(), sitemap(), partytown({ config: { forward: ['dataLayer.push'] } })],

  build: {
    output: 'static',
  },
 outDir: './temp'
 
});