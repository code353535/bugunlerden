/* empty css                                */
import { c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, e as addAttribute, u as unescapeHTML } from '../chunks/astro/server_74aKCQZx.mjs';
import 'kleur/colors';
import { _ as _export_sfc, k as fetchPosts, $ as $$Layout } from '../chunks/layout_C79cMFHt.mjs';
import { formatDistanceToNow, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import '@astrojs/internal-helpers/path';
import { $ as $$Image } from '../chunks/_astro_assets_0ybOokm9.mjs';
import { useSSRContext, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
export { renderers } from '../renderers.mjs';

const _sfc_main = {
  __name: 'IndexScroll',
  setup(__props, { expose: __expose }) {
  __expose();

      const truncateText = (text, length) => {
      if (!text) return '';
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
              query GetPosts($first: Int!, $after: String) {
                posts(first: $first, after: $after) {
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
      
const __returned__ = { truncateText, posts, hasMorePosts, cursor, loading, error, initialLoad, filteredPosts, loadMore, fetchPosts, ref, computed, onMounted, get axios() { return axios }, get formatDistanceToNow() { return formatDistanceToNow }, get tr() { return tr } };
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
return __returned__
}

};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<!--[--><section class="grid grid-cols-1 md:grid-cols-4 gap-8 min-h-16 mt-8 md:px-0 px-4"><!--[-->`);
  ssrRenderList($setup.filteredPosts, (post) => {
    _push(`<div id="remainingPosts" class="md:col-span-3 grid grid-cols-1 gap-8"><div class="flex flex-col md:flex-row md:items-stretch"><div class="relative w-full md:w-1/3 h-[250px] md:h-auto overflow-hidden group">`);
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
    _push(`</div><div class="relative flex flex-col justify-between p-4 dark:bg-[#212121] bg-gray-100 md:w-2/3"><h2 class="text-md md:text-xl baslik font-semibold"><a${
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
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/IndexScroll.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const IndexScroll = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender]]);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let posts = [];
  try {
    posts = await fetchPosts();
  } catch (error) {
    console.error("API error:", error);
  }
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const dortluPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(3, 7);
  const altPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(7, 15);
  posts.slice(0, 5).map(
    (post) => `<a href="/post/${post.slug}" class="bg-black text-white hover:underline text-lg py-1 px-4 baslik">${post.title}</a>`
  ).join(" - ");
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }
  function formatDate(postDate) {
    return format(new Date(postDate), "dd.MM.yyyy", { locale: tr });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Ana Sayfa", "description": "Dizi, TV, magazin, g\xFCndem haberleri, ya\u015Fam tarz\u0131, spor ve pop\xFCler k\xFClt\xFCr hakk\u0131nda en son geli\u015Fmeleri takip edebilece\u011Finiz, geni\u015F bir konu yelpazesiyle zenginle\u015Ftirilmi\u015F bir kaynakt\u0131r." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full"> <div class="relative grid grid-cols-1 md:grid-cols-4  md:h-[420px] gap-4 md:gap-[1px] max-md:px-4"> ${sortedPosts.map((post, index) => renderTemplate`<div${addAttribute(`${index === 0 ? "col-span-1 md:col-span-2" : "col-span-1 md:col-span-1"} relative overflow-hidden group`, "class")}> <div> ${post.imageUrl && renderTemplate`<a${addAttribute(`/post/${post.slug}`, "href")}> ${renderComponent($$result2, "Image", $$Image, { "src": post.imageUrl, "alt": post.altText, "loading": "lazy", "width": 420, "height": 420, "class": "w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105" })} </a>`} <div${addAttribute(`absolute left-0 bottom-0 py-4 px-4 block w-full ${index === 0 ? "bg-black/40 md:bg-black/40 text-white md:text-white md:dark:bg-black/40 dark:bg-black/40 dark:text-gray-100 w-full md:max-w-[75%] text-md md:text-2xl" : "bg-black/40 text-white text-md md:text-xl"}`, "class")}> <h2 class="font-bold baslik"> <a${addAttribute(`/post/${post.slug}`, "href")} class="olink"> ${post.title} </a> </h2> <div class="flex justify-between items-center mt-4 mb-1"> <div class="text-xs"> <span class="inline-block font-semibold bg-[#f9d73a] hover:bg-red-500 hover:text-white text-black px-2 py-1"> <a${addAttribute(`/category/${post.categorySlug}`, "href")}> ${post.category} </a> </span> </div> <div class="text-xs">${formatDate(post.date)}</div> </div> </div> </div> </div>`)} </div>  <div class="flex flex-row gap-4 items-center my-[50px] max-md:hidden"> <span class="w-16 h-1 bg-red-500"></span> <span class="text-lg font-bold text-center text-black dark:text-gray-100 relative uppercase baslik px-6">
Bunlarda ilgini çekebilir
</span> </div> <div class="grid grid-cols-1 md:grid-cols-4 min-h-16 gap-4 md:gap-[10px] mt-4 md:px-0 px-4"> ${dortluPosts.map((post) => renderTemplate`<div class="col-span-1"> <div class="flex flex-col h-full">  <div class="relative w-full h-[250px] md:h-[200px] overflow-hidden group"> ${post.imageUrl && renderTemplate`<a${addAttribute(`/post/${post.slug}`, "href")}> ${renderComponent($$result2, "Image", $$Image, { "src": post.imageUrl, "alt": post.altText, "loading": "lazy", "width": 250, "height": 250, "class": "w-full h-[250px] md:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105" })} </a>`} </div>  <div class="relative flex flex-col justify-between flex-grow p-4 dark:bg-[#212121] bg-gray-100">  <h2 class="text-md baslik font-semibold"> <a${addAttribute(`/post/${post.slug}`, "href")} class="olink">${post.title}</a> </h2> <div class="flex justify-between items-center mt-4"> <div class="text-xs"> <span class="inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white  bg-gray-200 px-1 py-1"> <a${addAttribute(`/category/${post.categorySlug}`, "href")}> ${post.category} </a> </span> </div>  <p class="flex justify-center text-xs text-gray-500"> ${formatDate(post.date)} </p> </div> <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class="max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> </div> </div>`)} </div>  <div class="flex flex-row gap-3 items-center my-[50px] max-md:hidden"> <span class="w-16 h-1 bg-red-500"></span> <span class="text-lg font-bold text-center text-black dark:text-gray-100 relative uppercase baslik px-6">
Daha fazlasını gör
</span> </div>  <section class="grid grid-cols-1 md:grid-cols-4 gap-8 min-h-screen mt-8 md:px-0 px-4">  <div id="remainingPosts" class="col-span-3 grid grid-cols-1 gap-8"> ${altPosts.map((post) => renderTemplate`<div class="flex flex-col md:flex-row md:items-stretch">  <div class="relative w-full md:w-1/3 h-[250px] md:h-auto overflow-hidden group"> ${post.imageUrl && renderTemplate`<a${addAttribute(`/post/${post.slug}`, "href")}> ${renderComponent($$result2, "Image", $$Image, { "src": post.imageUrl, "alt": post.altText, "loading": "lazy", "width": 250, "height": 250, "class": "w-full h-full object-cover  min-h-[250px] transition-transform duration-500 group-hover:scale-105" })} </a>`} </div>  <div class="relative flex flex-col justify-between p-4 dark:bg-[#212121] bg-gray-100 md:w-2/3">  <h2 class="text-md md:text-xl baslik font-semibold"> <a${addAttribute(`/post/${post.slug}`, "href")} class="olink"> ${post.title} </a> </h2> <p class="max-md:my-2">${unescapeHTML(truncateText(post.excerpt, 120))}</p> <div class="flex justify-between items-center mt-4"> <div class="text-xs"> <span class="inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white  bg-gray-200 px-1 py-1"> <a${addAttribute(`/category/${post.categorySlug}`, "href")}> ${post.category} </a> </span> </div>  <p class="flex justify-center text-xs text-gray-500"> ${formatDate(post.date)} </p> </div> <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class=" max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> </div>`)} </div>  <div>  <div class="hidden md:block col-span-1 z-10 h-1/2"> <div class="bg-gray-100 dark:bg-[#212121] h-[400px] sticky top-[80px] text-black dark:text-gray-100 p-4"> <div class="flex flex-col justify-between h-full"> <!-- Üst bölüm --> <div class="flex flex-col justify-center items-center"> <h3 class="text-lg font-semibold baslik">REKLAM ALANI</h3> <span class="mt-2 text-sm font-light">Bu alanda reklamınızı yayınlayalım.</span> <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class=" max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> <!-- Alt bölüm, en alta itilecek alan --> <div class="flex justify-center items-end mt-auto"> <span class="mt-2 text-lg font-medium">300 X 400</span> </div> </div> </div> </div>  <div class="hidden md:block col-span-1 z-10 h-1/2 mt-16"> <div class="bg-gray-100 dark:bg-[#212121] h-[400px] sticky top-[80px] text-black dark:text-gray-100 p-4"> <div class="flex flex-col justify-between h-full"> <!-- Üst bölüm --> <div class="flex flex-col justify-center items-center"> <h3 class="text-lg font-semibold baslik">REKLAM ALANI</h3> <span class="mt-2 text-sm font-light">Bu alanda reklamınızı yayınlayalım.</span> <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class=" max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> <!-- Alt bölüm, en alta itilecek alan --> <div class="flex justify-center items-end mt-auto"> <span class="mt-2 text-lg font-medium">300 X 400</span> </div> </div> </div> </div> </div> </section> ${renderComponent($$result2, "IndexScroll", IndexScroll, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/var/www/html/bugunlerden/src/components/IndexScroll.vue", "client:component-export": "default" })} </div> ` })}`;
}, "/var/www/html/bugunlerden/src/pages/index.astro", undefined);

const $$file = "/var/www/html/bugunlerden/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
