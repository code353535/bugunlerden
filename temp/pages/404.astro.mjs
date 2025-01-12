/* empty css                                */
import { c as createComponent, r as renderTemplate, a as renderHead } from '../chunks/astro/server_74aKCQZx.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="tr"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 sayfa bulunamadı | METROPOLLA.COM</title><meta name="description" content="Aradığınız sayfa bulunamadı">${renderHead()}</head> <body> <main class="h-screen w-full flex flex-col justify-center items-center dark:bg-[#141414] bg-white"> <span class="text-3xl font-bold baslik">Üzgünüz...</span> <h1 class="text-[200px] font-extrabold text-black dark:text-white tracking-widest baslik">404</h1> <div class="bg-red-500/90 px-2 py-1 text-2xl rounded rotate-12 absolute text-white baslik">
Aradığınız Sayfa Bulunamadı
</div> <span class="relative block px-8 py-3 bg-[#141414] border border-[#212121] border-current text-white"> <a href="/">Ana Sayfaya Dön</a> </span> </main> </body></html>`;
}, "/var/www/html/bugunlerden/src/pages/404.astro", undefined);

const $$file = "/var/www/html/bugunlerden/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
