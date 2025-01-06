/* empty css                                   */
import { b as createAstro, c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, F as Fragment, e as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_w720HbFP.mjs';
import 'kleur/colors';
import { _ as _export_sfc, b as fetchPostsByCategory, c as fetchCategori, $ as $$Layout } from '../../chunks/layout_CuyJ74l5.mjs';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useSSRContext, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import '@astrojs/internal-helpers/path';
import { $ as $$Image } from '../../chunks/_astro_assets_CxtJMpw0.mjs';
export { renderers } from '../../renderers.mjs';

const _sfc_main = {
  __name: 'CategoryScroll',
  props: {
    categorySlug: {
      type: String,
      required: true,
    },
  },
  setup(__props, { expose: __expose }) {
  __expose();

  const props = __props;

  const truncateText = (text, length) => {
  if (!text) return ''; // Eğer metin boşsa, 'deneme' döndür
  return text.length > length ? text.slice(0, length) + '...' : text;
};

  const posts = ref([]);
  const hasMorePosts = ref(true);
  const cursor = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const initialLoad = ref(true);
  
  const filteredPosts = computed(() => {
    return posts.value.slice(15); 
  });
  
  const loadMore = async () => {
  if (!loading.value && hasMorePosts.value) {
    loading.value = true;
    try {
      await fetchPosts(); 
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
    } finally {
      loading.value = false; 
    }
  }
};
  
  const fetchPosts = async () => {
    try {
      error.value = null;
      const count = initialLoad.value ? 15 : 6;
      const response = await axios.post('https://bugunlerde.com/api/wordpress/graphql', {
        query: `
          query GetPosts($first: Int!, $after: String, $categorySlug: String!) {
            posts(first: $first, after: $after, where: { categoryName: $categorySlug }) {
              nodes {
                id
                title
                slug
                excerpt
                date
                author {
                  node {
                    id
                    name
                    avatar {
                      url
                    }
                  }
                }
                categories {
                  nodes {
                    id
                    name
                    slug
                    description
                    parentId
                    children {
                      nodes {
                        id
                        name
                        slug
                      }
                    }
                  }
                }
                featuredImage {
                  node {
                    sourceUrl
                    altText
                    title
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        variables: {
          first: count,
          after: cursor.value, 
          categorySlug: props.categorySlug,
        },
      });
  
      // Transform the posts
      const transformedPosts = response.data.data.posts.nodes.map(post => {
        const authorId = post.author?.node?.id
          ? parseInt(atob(post.author?.node?.id).split(':')[1], 10)
          : null;
        const formattedDate = formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: tr });
        const selectedCategory = post.categories?.nodes?.[0];
        const categoryDescription = selectedCategory?.description || '';
        const categorySlug = selectedCategory?.slug || 'general';
  
        return {
          ...post,
          imageUrl: post.featuredImage?.node?.sourceUrl || null,
          altText: post.featuredImage?.node?.altText || '',
          imageTitle: post.featuredImage?.node?.title || '',
          authorId,
          formattedDate,
          author: post.author?.node?.name || 'Bilinmeyen',
          categorydesc: categoryDescription,
          category: selectedCategory ? selectedCategory.name : 'Genel',
          categorySlug,
        };
      });
  
      // Yeni gönderileri mevcut listeye ekle
    posts.value = [...posts.value, ...transformedPosts];

// Sayfalama bilgilerini güncelle
cursor.value = response.data.data.posts.pageInfo.endCursor;
hasMorePosts.value = response.data.data.posts.pageInfo.hasNextPage;

// İlk yükleme tamamlandıysa, durumu güncelle
if (initialLoad.value) initialLoad.value = false;
} catch (err) {
error.value = "Veriler yüklenirken bir hata oluştu.";
} finally {
loading.value = false;
}
};

  onMounted(() => {
  fetchPosts();
});
  
const __returned__ = { props, truncateText, posts, hasMorePosts, cursor, loading, error, initialLoad, filteredPosts, loadMore, fetchPosts, ref, computed, onMounted, get axios() { return axios }, get formatDistanceToNow() { return formatDistanceToNow }, get tr() { return tr } };
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
return __returned__
}

};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<!--[--><section class="grid grid-cols-1 md:grid-cols-4 gap-8 min-h-16 mt-8 md:px-0 px-4"><!--[-->`);
  ssrRenderList($setup.filteredPosts, (post) => {
    _push(`<div id="remainingPosts" class="col-span-3 grid grid-cols-1 gap-8"><div class="flex flex-col md:flex-row md:items-stretch"><div class="relative w-full md:w-1/3 h-[250px] md:h-auto overflow-hidden group">`);
    if (post.imageUrl) {
      _push(`<a${
        ssrRenderAttr("href", `/post/${post.slug}`)
      }><img${
        ssrRenderAttr("src", post.imageUrl)
      }${
        ssrRenderAttr("alt", post.altText)
      } loading="lazy" class="w-full h-[250px] md:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"></a>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="relative flex flex-col justify-between p-4 dark:bg-[#212121] bg-gray-100 md:w-2/3"><div class="text-xs mb-1 md:mb-0"><span class="inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white bg-gray-200 px-1 py-1"><a${
      ssrRenderAttr("href", `/category/${post.categorySlug}`)
    }>${
      ssrInterpolate(post.category)
    }</a></span></div><h2 class="text-md md:text-xl baslik font-semibold"><a${
      ssrRenderAttr("href", `/post/${post.slug}`)
    } class="olink">${
      ssrInterpolate(post.title)
    }</a></h2><p class="max-md:my-2">${
      ($setup.truncateText(post.excerpt, 120)) ?? ''
    }</p><div class="flex justify-between items-center mt-4"><div class="text-xs"><span class="inline-block font-semibold text-gray-500"><div class="flex items-center">`);
    if (post.authorAvatar) {
      _push(`<img${
        ssrRenderAttr("src", post.authorAvatar)
      }${
        ssrRenderAttr("alt", `${post.author} avatar`)
      } class="w-6 h-6 rounded-full mr-2">`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="text-sm"><span class="block text-xs"><a${
      ssrRenderAttr("href", `/author/${post.authorId}`)
    } class="olink">${
      ssrInterpolate(post.author)
    }</a></span></div></div></span></div><p class="flex justify-center text-xs text-gray-500">${
      ssrInterpolate(post.formattedDate)
    }</p></div><div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div><div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div></div><div class="max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div><div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div></div></div></div></div>`);
  });
  _push(`<!--]--></section><div class="flex justify-center items-center w-full my-8">`);
  if ($setup.hasMorePosts && !$setup.loading) {
    _push(`<button class="bg-red-500 px-2 py-1 cursor-pointer text-white text-sm font-semibold shadow-sm shadow-slate-500/50"> Daha Fazla Göster </button>`);
  } else if ($setup.loading) {
    _push(`<button${(ssrIncludeBooleanAttr($setup.loading)) ? " disabled" : ""} class="bg-red-500 px-2 py-1 text-white text-sm font-semibold shadow-sm shadow-slate-500/50"> Yükleniyor... </button>`);
  } else if (!$setup.hasMorePosts) {
    _push(`<p></p>`);
  } else {
    _push(`<!---->`);
  }
  if ($setup.error) {
    _push(`<p>${ssrInterpolate($setup.error)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/CategoryScroll.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const PostList = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender]]);

const $$Astro = createAstro("https://bugunlerde.com");
const prerender = false;
async function getStaticPaths() {
  const categories = await fetchCategori();
  return categories.map((category) => ({
    params: {
      slug: category.slug
    },
    fallback: "blocking"
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  let posts = [];
  try {
    posts = await fetchPostsByCategory(slug);
  } catch (err) {
  }
  const categories = await fetchCategori();
  const currentCategory = categories.find((c) => c.slug === slug);
  const categorydesc = currentCategory ? currentCategory.description : "Kategori a\xE7\u0131klamas\u0131 bulunamad\u0131.";
  const formattedPosts = posts.map((post) => ({
    ...post,
    formattedDate: formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: tr })
  }));
  const heroPosts = formattedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const remainingPosts = formattedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(3, 15);
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${slug} kategorisine ait i\xE7erikler`, "description": categorydesc }, { "default": ($$result2) => renderTemplate`${heroPosts.length === 0 ? renderTemplate`${maybeRenderHead()}<main class="h-screen w-full flex flex-col justify-center items-center dark:bg-[#141414] bg-white"> <span class="text-3xl font-bold baslik text-red-500">Üzgünüz...</span> <h3 class="px-4 text-[20px] font-extrabold text-black dark:text-white tracking-widest baslik">${slug} kategorisine, henüz bir içerik eklenmemiş.</h3> <span class="mt-10 relative block px-8 py-3 bg-[#141414] border border-[#212121] border-current text-white"> <a href="/">Ana Sayfaya Dön</a> </span> </main>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <div class="md:hidden relative px-2 py-2 mx-4 my-4 flex justify-center md:justify-start items-center text-xs baslik text-white dark:text-white font-bold uppercase bg-[#000] dark:bg-[#141414]">
kategori : ${slug} </div> <div class="w-full max-md:px-4 md:mt-0"> <div class="relative grid grid-cols-1 md:grid-cols-3 h-[900px] md:h-[420px] gap-8 md:gap-[1px]"> ${heroPosts.map((post) => renderTemplate`<div class="relative overflow-hidden group col-span-1"> <div> ${post.imageUrl && renderTemplate`<a${addAttribute(`/post/${post.slug}`, "href")}> ${renderComponent($$result3, "Image", $$Image, { "src": post.imageUrl, "alt": post.altText, "loading": "lazy", "width": 420, "height": 420, "class": "w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105" })} </a>`} <div class="absolute left-0 bottom-0 py-4 px-4 block w-full bg-black/40 text-white text-md md:text-xl"> <div class="flex justify-between items-center mb-3"> <div class="text-xs"> <span class="inline-block font-semibold bg-[#f9d73a] hover:bg-red-500 hover:text-white text-black px-2 py-1"> <a${addAttribute(`/category/${post.categorySlug}`, "href")}> ${post.category} </a> </span> </div> <div class="text-xs">${post.formattedDate}</div> </div> <h2 class="font-bold baslik"> <a${addAttribute(`/post/${post.slug}`, "href")} class="olink"> ${post.title} </a> </h2> <div class="flex items-center mt-4"> ${post.authorAvatar && renderTemplate`<img${addAttribute(post.authorAvatar, "src")}${addAttribute(`${post.author} avatar`, "alt")} class="w-6 h-6 rounded-full mr-2">`} <div class="text-sm"> <span class="block text-xs"><a${addAttribute(`/author/${post.authorId}`, "href")} class="olink">${post.author}</a> tarafından</span> </div> </div> </div> </div> </div>`)} </div> </div> ${remainingPosts.length === 0 ? renderTemplate`<div class="flex flex-col justify-center items-center mt-8"> <span class="text-xl font-bold baslik text-red-500">Daha fazlası çok yakında...</span> <h3 class="px-4 text-[12px] font-thin text-black dark:text-white tracking-widest baslik">${slug} kategorisi için, içerik bekleniyor.</h3> </div>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`<div class="flex flex-row gap-3 items-center my-[50px] max-md:hidden"> <span class="w-16 h-1 bg-red-500"></span> <span class="text-lg font-bold text-center text-black dark:text-gray-100 relative uppercase baslik px-6"> ${slug} kategorisinde daha fazlası
</span> </div> <section class="grid grid-cols-1 md:grid-cols-4 gap-8 min-h-screen mt-8 md:px-0 px-4">  <div id="remainingPosts" class="col-span-3 grid grid-cols-1 gap-8"> ${remainingPosts.map((post) => renderTemplate`<div class="flex flex-col md:flex-row md:items-stretch">  <div class="relative w-full md:w-1/3 h-[250px] md:h-auto overflow-hidden group"> ${post.imageUrl && renderTemplate`<a${addAttribute(`/post/${post.slug}`, "href")}> ${renderComponent($$result4, "Image", $$Image, { "src": post.imageUrl, "alt": post.altText, "loading": "lazy", "width": 250, "height": 250, "class": "w-full h-full object-cover  min-h-[250px] transition-transform duration-500 group-hover:scale-105" })} </a>`} </div>  <div class="relative flex flex-col justify-between p-4 dark:bg-[#212121] bg-gray-100 md:w-2/3"> <div class="text-xs mb-1 md:mb-0"> <span class="inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white  bg-gray-200 px-1 py-1"> <a${addAttribute(`/category/${post.categorySlug}`, "href")}> ${post.category} </a> </span> </div>  <h2 class="text-md md:text-xl baslik font-semibold"> <a${addAttribute(`/post/${post.slug}`, "href")} class="olink"> ${post.title} </a> </h2> <p class="max-md:my-2">${unescapeHTML(truncateText(post.excerpt, 120))}</p> <div class="flex justify-between items-center mt-4"> <div class="text-xs"> <span class="inline-block font-semibold text-gray-500"> <div class="flex items-center"> ${post.authorAvatar && renderTemplate`<img${addAttribute(post.authorAvatar, "src")}${addAttribute(`${post.author} avatar`, "alt")} class="w-6 h-6 rounded-full mr-2">`} <div class="text-sm"> <span class="block text-xs"> <a${addAttribute(`/author/${post.authorId}`, "href")} class="olink"> ${post.author} </a> </span> </div> </div> </span> </div>  <p class="flex justify-center text-xs text-gray-500"> ${post.formattedDate} </p> </div> <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class=" max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> </div>`)} </div>  <div>  <div class="hidden md:block col-span-1 z-10 h-1/2"> <div class="bg-gray-100 dark:bg-[#212121] h-[400px] sticky top-[80px] text-black dark:text-gray-100 p-4"> <div class="flex flex-col justify-between h-full"> <!-- Üst bölüm --> <div class="flex flex-col justify-center items-center"> <h3 class="text-lg font-semibold baslik">REKLAM ALANI</h3> <span class="mt-2 text-sm font-light">Bu alanda reklamınızı yayınlayalım.</span> <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class=" max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> <!-- Alt bölüm, en alta itilecek alan --> <div class="flex justify-center items-end mt-auto"> <span class="mt-2 text-lg font-medium">300 X 400</span> </div> </div> </div> </div>  <div class="hidden md:block col-span-1 z-10 h-1/2 mt-16"> <div class="bg-gray-100 dark:bg-[#212121] h-[400px] sticky top-[80px] text-black dark:text-gray-100 p-4"> <div class="flex flex-col justify-between h-full"> <!-- Üst bölüm --> <div class="flex flex-col justify-center items-center"> <h3 class="text-lg font-semibold baslik">REKLAM ALANI</h3> <span class="mt-2 text-sm font-light">Bu alanda reklamınızı yayınlayalım.</span> <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class=" max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> <!-- Alt bölüm, en alta itilecek alan --> <div class="flex justify-center items-end mt-auto"> <span class="mt-2 text-lg font-medium">300 X 400</span> </div> </div> </div> </div> </div> </section> ` })}`}${renderComponent($$result3, "PostList", PostList, { "client:visible": true, "categorySlug": slug, "client:component-hydration": "visible", "client:component-path": "/var/www/html/bugunlerden/src/components/CategoryScroll.vue", "client:component-export": "default" })} ` })}`}` })}`;
}, "/var/www/html/bugunlerden/src/pages/category/[slug].astro", undefined);

const $$file = "/var/www/html/bugunlerden/src/pages/category/[slug].astro";
const $$url = "/category/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
