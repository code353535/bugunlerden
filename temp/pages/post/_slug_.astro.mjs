/* empty css                                   */
import { b as createAstro, c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, e as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_74aKCQZx.mjs';
import 'kleur/colors';
import { g as getPostBySlug, h as fetchRelatedPosts, $ as $$Layout, i as getAllPostSlugs, j as $$Icon } from '../../chunks/layout_C79cMFHt.mjs';
import '@astrojs/internal-helpers/path';
import { $ as $$Image } from '../../chunks/_astro_assets_0ybOokm9.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://bugunlerde.com");
async function getStaticPaths() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({
    params: { slug: post.slug },
    fallback: "blocking"
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const post = await getPostBySlug(slug);
  let selectedCategory;
  if (post.categories?.nodes?.length > 0) {
    selectedCategory = post.categories.nodes.find((cat) => cat.parentId);
    if (!selectedCategory) {
      selectedCategory = post.categories.nodes[0];
    }
  }
  function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.replace(/(<([^>]+)>)/gi, "").split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
  const readingTime = calculateReadingTime(post.content);
  const relatedPosts = await fetchRelatedPosts(post.categorySlug, post.id);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": post.title, "description": post.description, "image": post.featuredImage.node.sourceUrl, "uri": post.uri }, { "default": ($$result2) => renderTemplate`${post ? renderTemplate`${maybeRenderHead()}<div class="max-w-screen-md mx-auto flex flex-col justify-center items-center gap-4"> <!-- Featured Image --> <div class="relative"> ${post.featuredImage && renderTemplate`${renderComponent($$result2, "Image", $$Image, { "class": "md:max-w-[768px] md:max-h-[518px] w-full md:min-w-[768px] min-h-[350px] md:min-h-[518px] object-cover", "src": post.featuredImage.node.sourceUrl, "alt": post.featuredImage.node.altText || "Post G\xF6rseli", "width": 768, "height": 518, "loading": "lazy" })}`} <!-- Title --> <div class="baslik max-md:hidden absolute left-0 bottom-0 dark:text-gray-100 text-black text-3xl font-bold bg-white dark:bg-[#141414] px-2 py-4 md:max-w-[70%]"> <h2>${post.title}</h2> </div> </div> <div class="baslik md:hidden dark:text-gray-300 text-slate-900 text-3xl font-bold px-4 py-2"> <h2>${post.title}</h2> </div> <!-- Category and Metadata --> <div class="flex justify-between items-center w-full max-lg:px-4 mb-4"> <div> ${selectedCategory && renderTemplate`<div class="inline-block font-semibold text-xs bg-[#f9d73a] hover:bg-red-500 hover:text-white text-slate-900 px-2 py-1 rounded"> <a${addAttribute(`/category/${post.categorySlug}`, "href")}>${selectedCategory.name}</a> </div>`} </div> <div class="text-xs flex items-center text-slate-900 dark:text-gray-200"> ${new Date(post.date).toLocaleDateString()} | ${renderComponent($$result2, "Icon", $$Icon, { "name": "author", "class": "px-1 text-[24px] max-md:hidden" })} <a${addAttribute(`/author/${post.authorId}`, "href")} class="max-md:hidden mr-1 olink">${post.author}</a> | ${renderComponent($$result2, "Icon", $$Icon, { "name": "reading", "class": "px-1 text-[24px]" })} ${readingTime} dakika
</div> </div> <!-- Description --> ${post.description && renderTemplate`<div class="max-lg:px-4"> <div class="dark:text-gray-300 text-black corner-only"> <div class="px-6 py-6">${unescapeHTML(post.description)}</div> </div> </div>`} <!-- Content --> <div class="mt-4 max-lg:px-4 dark:text-gray-300 text-black"> <div>${unescapeHTML(post.content)}</div> </div> <div class="flex items-center mt-4"> <span class="text-sm mr-4 font-semibold">Bu içeriği sosyal medyada paylaş : </span> <a${addAttribute(`https://www.facebook.com/sharer/sharer.php?u=https://bugunlerde.com/post/${post.slug}`, "href")} target="_blank" rel="noopener noreferrer"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "facebook", "class": "p-0.5 mr-2 text-[24px] rounded text-[#000] bg-[#d7b82b] hover:shadow-sm shadow-md shadow-slate-500/50" })} </a> <a${addAttribute(`https://twitter.com/intent/tweet?url=https://bugunlerde.com/post/${post.slug}&text=${encodeURIComponent(post.title)}`, "href")} target="_blank" rel="noopener noreferrer"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "twitter", "class": "p-0.5 mr-2 text-[24px] rounded text-[#000] bg-[#d7b82b] hover:shadow-sm shadow-md shadow-slate-500/50" })} </a> </div> <!-- Yazar Alanı --> <div class="w-full dark:border-t dark:border-b bg-[#e9e9e9] dark:bg-[#141414] dark:border-gray-800 p-4 py-4 flex items-center gap-4 mt-10"> <!-- Yazar Avatarı --> ${renderComponent($$result2, "Image", $$Image, { "src": post.authorAvatar || "default-avatar.png", "alt": `${post.author}`, "width": 80, "height": 80, "class": "rounded-full object-cover border-2 dark:shadow-none shadow-lg shadow-slate-500/50 border-[#f9d73a]" })} <!-- Yazar Bilgileri --> <div class="flex flex-col justify-center"> <span class="text-xs font-normal uppercase">yazar</span> <span class="text-lg font-bold text-gray-800 dark:text-gray-200"> <a${addAttribute(`/author/${post.authorId}`, "href")} class="olink">${post.author}</a> </span> <span class="text-sm text-gray-800 font-extralight dark:text-gray-200">${post.authorBio}</span> </div> </div> <!-- Previous and Next Post Navigation --> <div class="max-lg:px-4 w-full"> <div class="grid grid-cols-2 max-sm:grid-cols-1 w-full mt-10 gap-4">  ${post.previousPost ? renderTemplate`<div class="col-span-1 px-2 py-4 bg-[#000] dark:bg-[#141414] dark:border dark:border-gray-800 group"> <a${addAttribute(`/post/${post.previousPost.slug}`, "href")} class="flex items-center text-lg text-gray-200 group"> ${post.previousPost.featuredImage && renderTemplate`<img class="w-20 h-20 object-cover rounded-full mx-2 border-[#828282] border-2 border-dashed opacity-70 group-hover:opacity-100 transition duration-200 ease-in-out"${addAttribute(post.previousPost.featuredImage.node.sourceUrl, "src")}${addAttribute(post.previousPost.featuredImage.node.altText || "Previous Post Image", "alt")}>`} <div class="flex flex-col px-2"> <span class="text-xs font-bold text-[#f9d73a] flex justify-start items-center group-hover:-translate-x-1 
                             duration-300 ease-in-out">${renderComponent($$result2, "Icon", $$Icon, { "name": "arrow-left", "class": "px-1 text-[32px]" })}Önceki Yazı</span> <span class="text-sm font-extralight">${post.previousPost.title}</span> </div> </a> </div>` : renderTemplate`<div class="col-span-1 px-2 py-4 bg-[#000] dark:bg-[#141414] dark:border dark:border-gray-800 group"> <div class="flex flex-col px-2"> <span class="text-xs font-bold text-[#f9d73a]">Önceki Yazı</span> <span class=" text-sm font-extralight text-gray-200">Yazı bulunamadı</span> </div> </div>`}  ${post.nextPost ? renderTemplate`<div class="col-span-1 px-2 py-4 bg-[#000] dark:bg-[#141414] dark:border dark:border-gray-800 group"> <a${addAttribute(`/post/${post.nextPost.slug}`, "href")} class="flex items-center justify-end text-gray-200"> <div class="flex flex-col px-2"> <span class="text-xs font-bold text-[#f9d73a] flex justify-end items-center group-hover:translate-x-1 
                             duration-300 ease-in-out">Sonraki Yazı ${renderComponent($$result2, "Icon", $$Icon, { "name": "arrow-right", "class": "px-1 text-[32px]" })}</span> <span class="text-sm font-extralight">${post.nextPost.title}</span> </div> ${post.nextPost.featuredImage && renderTemplate`<img class="w-20 h-20 object-cover border-[#828282] border-dashed border-2 rounded-full opacity-70 group-hover:opacity-100 transition duration-200 ease-in-out mx-2"${addAttribute(post.nextPost.featuredImage.node.sourceUrl, "src")}${addAttribute(post.nextPost.featuredImage.node.altText || "Next Post Image", "alt")}>`} </a> </div>` : renderTemplate`<div class="col-span-1 px-2 py-4 bg-[#000] dark:bg-[#141414] dark:border dark:border-gray-800 group"> <div class="flex flex-col"> <span class="text-xs mr-4 font-bold text-[#f9d73a] flex justify-end items-center">Sonraki Yazı</span> <span class="mr-4 text-sm font-extralight text-gray-200 flex justify-end">Yazı bulunamadı</span> </div> </div>`} </div> </div> <div class="flex flex-row gap-3 justify-center items-center my-[30px] md:my-[50px] relative"> <span class="w-16 h-1 bg-red-500"></span> <span class="text-md font-bold text-center text-black dark:text-gray-100 relative uppercase baslik px-4">
Bunlarda İlgini Çekebilir
</span> <span class="w-16 h-1 bg-red-500"></span> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:px-0 px-4 auto-rows-fr">  ${relatedPosts && relatedPosts.length > 0 ? relatedPosts.map((post2) => renderTemplate`<div class="col-span-1 h-full">  <div class="relative w-full h-[200px] md:h-[150px] overflow-hidden group"> ${post2.imageUrl && renderTemplate`<a${addAttribute(`/post/${post2.slug}`, "href")}> ${renderComponent($$result2, "Image", $$Image, { "src": post2.imageUrl, "alt": post2.altText || "Post image", "loading": "lazy", "width": 200, "height": 200, "class": "w-full h-[200px] md:h-[150px] object-cover transition-transform duration-500 group-hover:scale-105" })} </a>`} </div>  <div class="relative flex flex-col justify-between p-4 dark:bg-[#212121] bg-gray-100 h-auto md:h-[120px]">  <h3 class="text-md font-semibold"> <a${addAttribute(`/post/${post2.slug}`, "href")} class="olink"> ${post2.title} </a> </h3>  <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class="max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> </div>`) : (
    // Display a fallback message when no related posts are found
    renderTemplate`<p class="text-center text-gray-500">İlgili yazılar bulunamadı.</p>`
  )} </div> </div>` : renderTemplate`<p>Post bulunamadı!</p>`}` })}`;
}, "/var/www/html/bugunlerden/src/pages/post/[slug].astro", undefined);

const $$file = "/var/www/html/bugunlerden/src/pages/post/[slug].astro";
const $$url = "/post/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
