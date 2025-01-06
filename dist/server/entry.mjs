import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BIdom3Pi.mjs';
import { manifest } from './manifest_ClUolgnx.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/author/_id_.astro.mjs');
const _page3 = () => import('./pages/category/_slug_.astro.mjs');
const _page4 = () => import('./pages/gizlilik-politikasi.astro.mjs');
const _page5 = () => import('./pages/hakkimizda.astro.mjs');
const _page6 = () => import('./pages/kullanim-kosullari.astro.mjs');
const _page7 = () => import('./pages/post/_slug_.astro.mjs');
const _page8 = () => import('./pages/reklam.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/author/[id].astro", _page2],
    ["src/pages/category/[slug].astro", _page3],
    ["src/pages/gizlilik-politikasi.astro", _page4],
    ["src/pages/hakkimizda.astro", _page5],
    ["src/pages/kullanim-kosullari.astro", _page6],
    ["src/pages/post/[slug].astro", _page7],
    ["src/pages/reklam.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///var/www/html/bugunlerden/dist/client/",
    "server": "file:///var/www/html/bugunlerden/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
