/* empty css                                   */
import { b as createAstro, c as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, F as Fragment, e as addAttribute } from '../../chunks/astro/server_w720HbFP.mjs';
import 'kleur/colors';
import { _ as _export_sfc, f as fetchPostsByAuthor, a as fetchAuthors, d as decodeBase64Id, $ as $$Layout } from '../../chunks/layout_CuyJ74l5.mjs';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useSSRContext, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import '@astrojs/internal-helpers/path';
import { $ as $$Image } from '../../chunks/_astro_assets_CxtJMpw0.mjs';
export { renderers } from '../../renderers.mjs';

const _sfc_main = {
  __name: 'AuthorScroll',
  props: {
  authorId: {
    type: String,
    required: true,
  },
},
  setup(__props, { expose: __expose }) {
  __expose();

const props = __props;

const posts = ref([]);
const hasMorePosts = ref(true);
const cursor = ref(null);
const loading = ref(false);
const error = ref(null);
const initialLoad = ref(true);

const filteredPosts = computed(() => {
  return posts.value.slice(12); 
});

const loadMore = async () => {
  if (!loading.value && hasMorePosts.value) {
    loading.value = true;
    try {
      await fetchAuthor(); 
    } catch (err) {
      console.error("Veri yükleme hatası:", err);
    } finally {
      loading.value = false;
    }
  }
};

const fetchAuthor = async () => {
  try {
    error.value = null;
    const count = initialLoad.value ? 12 : 8; // İlk yüklemede 12 gönderi, sonrasında 8 gönderi
    const response = await axios.post('https://bugunlerde.com/api/wordpress/graphql', {
      query: `
        query GetAuthor($first: Int!, $after: String, $id: Int!) {
          posts(first: $first, after: $after, where: { author: $id }) {
            nodes {
              id
              title
              slug
              date
              author {
                node {
                  id
                }
              }
              categories {
                nodes {
                  id
                  name
                  slug
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
              endCursor
              hasNextPage
            }
          }
        }
      `,
      variables: {
        first: count,
        after: cursor.value,
        id: parseInt(props.authorId, 10),
      },
    });

    // Dönüşen gönderileri işleyin
    const transformedPosts = response.data.data.posts.nodes.map(post => {
      const formattedDate = formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: tr });
      const selectedCategory = post.categories?.nodes?.[0];
      return {
        ...post,
        imageUrl: post.featuredImage?.node?.sourceUrl || null,
        altText: post.featuredImage?.node?.altText || '',
        formattedDate,
        category: selectedCategory ? selectedCategory.name : 'Genel',
        categorySlug: selectedCategory?.slug || 'general',
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
    fetchAuthor();
});

const __returned__ = { props, posts, hasMorePosts, cursor, loading, error, initialLoad, filteredPosts, loadMore, fetchAuthor, ref, computed, onMounted, get axios() { return axios }, get formatDistanceToNow() { return formatDistanceToNow }, get tr() { return tr } };
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
return __returned__
}

};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<!--[--><div id="remainingPosts" class="grid grid-cols-1 md:grid-cols-4 min-h-16 gap-4 md:gap-[10px] mt-4 md:px-0 px-4"><!--[-->`);
  ssrRenderList($setup.filteredPosts, (post) => {
    _push(`<div class="col-span-1"><div class="flex flex-col h-full"><div class="relative w-full h-[250px] md:h-[200px] overflow-hidden group">`);
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
    _push(`</div><div class="relative flex flex-col justify-between flex-grow p-4 dark:bg-[#212121] bg-gray-100"><h3 class="text-md baslik font-semibold"><a${
      ssrRenderAttr("href", `/post/${post.slug}`)
    } class="olink">${
      ssrInterpolate(post.title)
    }</a></h3><div class="flex justify-between items-center mt-4"><div class="text-xs"><span class="inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white bg-gray-200 px-1 py-1"><a${
      ssrRenderAttr("href", `/category/${post.categorySlug}`)
    }>${
      ssrInterpolate(post.category)
    }</a></span></div><p class="flex justify-center text-xs text-gray-500">${
      ssrInterpolate(post.formattedDate)
    }</p></div><div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div><div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div></div><div class="max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div><div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div></div></div></div></div>`);
  });
  _push(`<!--]--></div><div class="flex justify-center items-center my-8">`);
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
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/AuthorScroll.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const AuthorScroll = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender]]);

const $$Astro = createAstro("https://bugunlerde.com");
const prerender = false;
async function getStaticPaths() {
  const authors = await fetchAuthors();
  const paths = authors.map((author) => {
    const decodedId = author.id ? decodeBase64Id(author.id) : null;
    return {
      params: { id: decodedId ? decodedId.toString() : "" }
    };
  });
  return paths;
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  let posts = [];
  let authorName = "";
  try {
    posts = await fetchPostsByAuthor(id);
    const authors = await fetchAuthors();
    const author = authors.find((author2) => decodeBase64Id(author2.id).toString() === id);
    authorName = author ? author.name : "Yazar bulunamad\u0131";
  } catch (err) {
  }
  const formattedPosts = posts.map((post) => ({
    ...post,
    formattedDate: formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: tr })
  }));
  const remainingPosts = formattedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 12);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${authorName} isimli yazara ait i\xE7erikler`, "description": `${authorName} isimli yazara ait i\xE7erikler` }, { "default": ($$result2) => renderTemplate`${remainingPosts.length === 0 ? renderTemplate`${maybeRenderHead()}<p class="text-center col-span-1 mt-6 h-[100vh]">${authorName} tarafından yazılan henüz bir gönderi yok.</p>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <div class="md:hidden relative px-2 py-2 mx-4 my-4 flex justify-center md:justify-start items-center text-xs baslik text-white dark:text-white font-bold uppercase bg-[#000] dark:bg-[#141414]">
Yazar: ${authorName} </div> <div class="flex flex-row gap-4 items-center my-[50px] max-md:hidden"> <span class="w-16 h-1 bg-red-500"></span> <span class="text-lg font-bold text-center text-black dark:text-gray-100 relative uppercase baslik px-6">
Yazar : ${authorName} </span> </div> ${remainingPosts.length < 4 ? renderTemplate`<div class="flex flex-col justify-center items-center mt-8"> <span class="text-xl font-bold baslik text-red-500">Daha fazlası çok yakında...</span> <h3 class="px-4 text-[12px] font-thin text-black dark:text-white tracking-widest baslik">${authorName} yazarı için, içerik bekleniyor.</h3> </div>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate` <div id="remainingPosts" class="grid grid-cols-1 md:grid-cols-4 min-h-16 gap-4 md:gap-[10px] mt-4 md:px-0 px-4"> ${remainingPosts.map((post) => renderTemplate`<div class="col-span-1"> <div class="flex flex-col h-full">  <div class="relative w-full h-[250px] md:h-[200px] overflow-hidden group"> ${post.imageUrl && renderTemplate`<a${addAttribute(`/post/${post.slug}`, "href")}> ${renderComponent($$result4, "Image", $$Image, { "src": post.imageUrl, "alt": post.altText, "loading": "lazy", "width": 250, "height": 250, "class": "w-full h-[250px] md:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105" })} </a>`} </div>  <div class="relative flex flex-col justify-between flex-grow p-4 dark:bg-[#212121] bg-gray-100">  <h2 class="text-md baslik font-semibold"> <a${addAttribute(`/post/${post.slug}`, "href")} class="olink">${post.title}</a> </h2> <div class="flex justify-between items-center mt-4"> <div class="text-xs"> <span class="inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white  bg-gray-200 px-1 py-1"> <a${addAttribute(`/category/${post.categorySlug}`, "href")}> ${post.category} </a> </span> </div>  <p class="flex justify-center text-xs text-gray-500"> ${post.formattedDate} </p> </div> <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div> </div> <div class="max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"> <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div> <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div> </div> </div> </div> </div>`)} </div> ` })}`}${renderComponent($$result3, "AuthorScroll", AuthorScroll, { "client:visible": true, "authorId": id, "client:component-hydration": "visible", "client:component-path": "/var/www/html/bugunlerden/src/components/AuthorScroll.vue", "client:component-export": "default" })} ` })}`}` })}`;
}, "/var/www/html/bugunlerden/src/pages/author/[id].astro", undefined);

const $$file = "/var/www/html/bugunlerden/src/pages/author/[id].astro";
const $$url = "/author/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
