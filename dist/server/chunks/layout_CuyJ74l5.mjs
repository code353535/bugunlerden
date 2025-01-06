import { b as createAstro, c as createComponent, r as renderTemplate, m as maybeRenderHead, s as spreadAttributes, e as addAttribute, d as renderComponent, u as unescapeHTML, F as Fragment, a as renderHead, l as renderSlot } from './astro/server_w720HbFP.mjs';
import 'kleur/colors';
/* empty css                        */
import axios from 'axios';
import { useSSRContext, ref, onMounted } from 'vue';
import { ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderAttrs } from 'vue/server-renderer';
import { getIconData, iconToSVG } from '@iconify/utils';
import 'clsx';

const decodeBase64Id = (encodedId) => {
    const decodedString = atob(encodedId);
    const parts = decodedString.split(':');
    return parts[1];
  };

const mapPost = (post) => {
    let selectedCategory = null;
    if (post.categories?.nodes?.length > 0) {
      selectedCategory = post.categories.nodes.find((cat) => cat.parentId) || post.categories.nodes[0];
    }
  
    const categorySlug = selectedCategory ? selectedCategory.slug : 'genel';
    const authorId = post.author?.node?.id ? decodeBase64Id(post.author.node.id) : null;
    const categoryDescription = selectedCategory ? selectedCategory.description : 'Açıklama mevcut değil';
  
    return {
      ...post,
      imageUrl: post.featuredImage?.node?.sourceUrl || null,
      altText: post.featuredImage?.node?.altText || '',
      imageTitle: post.featuredImage?.node?.title || '',
      authorId,
      author: post.author?.node?.name || 'Bilinmeyen',
      authorAvatar: post.author?.node?.avatar?.url || null,
      categorydesc: categoryDescription,
      category: selectedCategory ? selectedCategory.name : 'Genel',
      categorySlug,
    };
  };

const mapCategory = (category) => {
    return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        children: category.children.nodes.map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          slug: subCategory.slug,
      })),
    };
  };

// API uç noktası
const WP_API_URL = 'https://bugunlerde.com/api/wordpress/graphql';

// Genel API Çağrı İşleyicisi
const fetchData = async (query, variables = {}) => {
  try {
    const response = await axios.post(WP_API_URL, { query, variables });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
};

// Gönderilerin listesi 
const fetchPosts = async () => {
  const query = `
    query GetPosts {
      posts(first: 100) {
        nodes {
          id
          title
          slug
          date
          excerpt
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
      }
    }
  `;

  const data = await fetchData(query); 
  return data.posts.nodes.map(mapPost);
};

///Tüm slug ları alır.
async function getAllPostSlugs() {
  const query = `
    query {
      posts(first: 100){
        nodes {
          slug
        }
      }
    }
  `;
    const data = await fetchData(query); 
    return data.posts.nodes;
}


async function getPostBySlug(slug) {
  const query = `
    query GetPostBySlug($slug: String!) {
      postBy(slug: $slug) {
        id
        title
        slug
        uri
        content
        date
        excerpt
        postDescription
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            id
            name
            avatar {
              url
            }
            description
          }
        }
        categories {
          nodes {
            id
            name
            slug
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
      }
      posts(first: 100) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchData(query, { slug });

    const { postBy, posts } = data;

    // Find the current post's index and handle edge cases for next and previous posts
    const currentIndex = posts.nodes.findIndex((p) => p.slug === slug);
    const [previousPost, nextPost] = [
      posts.nodes[currentIndex - 1] || null,
      posts.nodes[currentIndex + 1] || null,
    ];

    // Apply mapPost function to format the current, previous, and next posts
    const formattedPost = mapPost(postBy);           // Apply mapPost to the main post
    const formattedPreviousPost = previousPost ? mapPost(previousPost) : null;  // Apply mapPost to previous post
    const formattedNextPost = nextPost ? mapPost(nextPost) : null;  // Apply mapPost to next post

    // Process categories and select the appropriate category
    const categories = postBy.categories.nodes;
    const selectedCategory = categories.find((cat) => cat.parentId) || categories[0];
    const categorySlug = selectedCategory?.slug || 'genel';

    // Extract and decode author info
    const { author } = postBy;
    const authorId = author?.node?.id ? decodeBase64Id(author.node.id) : null;

    return {
      ...formattedPost,  // Return the formatted post data
      selectedCategory,
      categorySlug,
      previousPost: formattedPreviousPost,
      nextPost: formattedNextPost,
      description: postBy.postDescription || '',
      authorId: authorId || null,
      author: author?.node?.name || 'Bilinmeyen',
      authorAvatar: author?.node?.avatar?.url || null,
      authorBio: author?.node?.description || '',
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw new Error('Failed to fetch post by slug');
  }
}

// Fetch all categories
const fetchCategories = async () => {
  const query = `
    query GetCategories {
      categories(where: { parent: 0 }) {
        nodes {
          id
          name
          slug
          children {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchData(query);
    return data.categories.nodes.map(mapCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

const fetchPostsByCategory = async (slug) => {
  const query = `
    query GetPostsByCategory($slug: String!, $first: Int!) {
      posts(where: {categoryName: $slug}, first: $first) {
        nodes {
          id
          title
          slug
          content
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
  `;

  try {
    const data = await fetchData(query, { slug, first: 15 });
    return data.posts.nodes.map(mapPost);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw new Error('Failed to fetch posts by category');
  }
};


const fetchCategori = async () => {
  const query =`
    query GetCategories {
      categories {
        nodes {
          slug
          description
        }
      }
    }
  `;

  try {
    const data = await fetchData(query);
    return data.categories.nodes.map((category) => ({
      slug: category.slug,
      description: category.description,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};


const fetchPostsByAuthor = async (id, cursor = null) => {
  const intId = parseInt(id, 10);

  if (isNaN(intId)) {
    throw new Error('Invalid author ID');
  }

  const query = `
    query GetPostsByAuthor($id: Int!, $first: Int!, $after: String) {
      posts(where: { author: $id }, first: $first, after: $after) {
        nodes {
          id
          title
          slug
          content
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
  `;

  try {
    const data = await fetchData(query, { id: intId, first: 12, after: cursor });

    if (data.posts.nodes) {
      return data.posts.nodes.map(mapPost); 
    } else {
      throw new Error('No posts found for this author');
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
};

const fetchAuthors = async () => {
  const query = `
    query GetAuthors {
      users {
        nodes {
          id
          name
          slug
        }
      }
    }
  `;

  try {
    // Use the generalized fetchData function
    const data = await fetchData(query);

    // Ensure the structure is correct and map the authors
    return data.users.nodes.map(({ id, name, slug }) => ({
      id,
      name,
      slug,
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw new Error('Failed to fetch authors');
  }
};

// Fetch related posts function using fetchData
const fetchRelatedPosts = async (categorySlug, postId) => {
  const query = `
    query GetRelatedPosts($categorySlug: String!, $postId: ID!) {
      posts(where: { categoryName: $categorySlug, notIn: [$postId] }, first: 6) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `;

  try {
    // Use the generalized fetchData function
    const data = await fetchData(query, { categorySlug, postId });

    // Ensure the structure is correct and map the related posts
    return data.posts.nodes.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      imageUrl: post.featuredImage?.node?.sourceUrl || null,
    }));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw new Error('Failed to fetch related posts');
  }
};

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

// Menü Durumu

const _sfc_main$1 = {
  __name: 'MobileMenu',
  setup(__props, { expose: __expose }) {
  __expose();

const MobilMenu = ref(false);
const selectedCategory = ref(null);

// Kategoriler ve durumlar
const categories = ref([]);
const error = ref(null);

// Menü Aç/Kapat Fonksiyonu
const toggleMenu = () => {
  MobilMenu.value = !MobilMenu.value;
};

// WordPress'ten Kategorileri Getirme Fonksiyonu
const fetchCategories = async () => {
  try {
    const response = await fetch('https://bugunlerde.com/api/wordpress/wp-json/wp/v2/categories');
    if (!response.ok) throw new Error('Kategoriler alınırken hata oluştu!');
    let allCategories = await response.json();

    // Filter out top-level categories
    categories.value = allCategories.filter(category => category.parent === 0);

    // Add subcategories by grouping categories with the same parent
    categories.value.forEach(category => {
      category.subcategories = allCategories.filter(subcategory => subcategory.parent === category.id);
    });
  } catch (err) {
    error.value = err.message;
  }
};

// Bileşen Yüklendiğinde Kategorileri Getir
onMounted(() => {
  fetchCategories();
});

// Category Toggle Function
const toggleCategory = (categoryId) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId;
};

// Navigate to category link if no subcategories
const navigateToCategory = (slug) => {
  window.location.href = `/category/${slug}`;
};

// Transition Hook to Disable Transition on Close
const beforeLeave = (el) => {
  el.style.transition = 'none'; // Disable transition for instant close
};

const __returned__ = { MobilMenu, selectedCategory, categories, error, toggleMenu, fetchCategories, toggleCategory, navigateToCategory, beforeLeave, ref, onMounted };
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
return __returned__
}

};

function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<!--[--><button aria-label="Menüyü Aç/Kapat" class="flex items-center" data-v-f8dc16ce><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-7 h-7 text-black dark:text-white dark:hover:text-red-600 hover:text-red-600" data-v-f8dc16ce><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" data-v-f8dc16ce></path></svg></button>`);
  if ($setup.MobilMenu) {
    _push(`<div class="fixed inset-0 z-50 flex" data-v-f8dc16ce><div class="bg-[#d7b82b] text-black w-full p-4" data-v-f8dc16ce><div class="flex justify-between border-b border-[#9a8529] dark:border-[#9a8529]" data-v-f8dc16ce><div class="pb-4 flex flex-row items-center min-h-12" data-v-f8dc16ce><span class="baslik text-xl text-black font-black whitespace-nowrap animate-charcter" data-v-f8dc16ce> BUGUNLERDE.COM </span></div><div data-v-f8dc16ce><button class="text-black focus:outline-none mb-4" data-v-f8dc16ce><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="font-bold w-6 h-6 hover:text-red-600 text-black" data-v-f8dc16ce><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f8dc16ce></path></svg></button></div></div><nav class="mt-6 text-black dark:text-black" data-v-f8dc16ce><!--[-->`);
    ssrRenderList($setup.categories, (category) => {
      _push(`<div data-v-f8dc16ce><div class="group mb-4 mx-2 mt-6" data-v-f8dc16ce><div class="flex items-center cursor-pointer" data-v-f8dc16ce><span class="flex text-xl tracking-wide font-bold uppercase" data-v-f8dc16ce>`);
      if (category.subcategories.length === 0) {
        _push(`<a${
          ssrRenderAttr("href", `/category/${category.slug}`)
        } data-v-f8dc16ce>${
          ssrInterpolate(category.name)
        }</a>`);
      } else {
        _push(`<span data-v-f8dc16ce><div class="flex items-center" data-v-f8dc16ce>${
          ssrInterpolate(category.name)
        } <svg xmlns="http://www.w3.org/2000/svg" class="${
          ssrRenderClass([{'rotate-180': $setup.selectedCategory === category.id}, "ml-2 w-5 h-5 transition-transform"])
        }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" data-v-f8dc16ce><path d="M19 9l-7 7-7-7" data-v-f8dc16ce></path></svg></div></span>`);
      }
      _push(`</span></div>`);
      if ($setup.selectedCategory === category.id) {
        _push(`<div class="mt-4 font-bold tracking-wide text-xl uppercase" data-v-f8dc16ce><!--[-->`);
        ssrRenderList(category.subcategories, (subcategory, index) => {
          _push(`<div style="${
            ssrRenderStyle({ animationDelay: `${index * 0.1}s` })
          }" class="subcategory-item mb-3" data-v-f8dc16ce><a${
            ssrRenderAttr("href", `/category/${subcategory.slug}`)
          } class="flex items-center px-4 text-xl font-bold uppercase" data-v-f8dc16ce>${
            ssrInterpolate(subcategory.name)
          }</a></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    });
    _push(`<!--]--></nav></div><div class="flex-grow" data-v-f8dc16ce></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<!--]-->`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/MobileMenu.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined
};
const MobileMenu = /*#__PURE__*/_export_sfc(_sfc_main$1, [['ssrRender',_sfc_ssrRender$1],['__scopeId',"data-v-f8dc16ce"]]);

const icons = {"local":{"prefix":"local","lastModified":1736197142,"icons":{"arrow-down":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 4v16m0 0-4-4m4 4 4-4\"/>"},"arrow-left":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 12h12M6 12l5-5m-5 5 5 5\"/>"},"arrow-right":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 12h12m0 0-5-5m5 5-5 5\"/>"},"arrow-up":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 4v16m0-16L8 8m4-4 4 4\"/>"},"author":{"body":"<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M8.5 21H4a7 7 0 0 1 7.5-6.982M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0m-2.41 14 2.025-.405a2 2 0 0 0 .347-.085 1 1 0 0 0 .207-.111c.072-.05.136-.114.263-.242L19.59 16a1.414 1.414 0 1 0-2-2l-4.158 4.157c-.127.128-.19.191-.241.264a1 1 0 0 0-.11.207c-.033.082-.05.17-.086.347z\"/>"},"facebook":{"body":"<path fill=\"currentColor\" d=\"M12 2C6.477 2 2 6.477 2 12c0 5.013 3.693 9.153 8.505 9.876V14.65H8.031v-2.629h2.474v-1.749c0-2.896 1.411-4.167 3.818-4.167 1.153 0 1.762.085 2.051.124v2.294h-1.642c-1.022 0-1.379.969-1.379 2.061v1.437h2.995l-.406 2.629h-2.588v7.247C18.235 21.236 22 17.062 22 12c0-5.523-4.477-10-10-10\"/>"},"hamburger":{"body":"<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M15 24H2a2 2 0 0 0 0 4h13a2 2 0 0 0 0-4m11-8H2a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4m0-8H2a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4M2 4h24a2 2 0 0 0 0-4H2a2 2 0 0 0 0 4\"/>","width":28,"height":28},"instagram":{"body":"<path fill=\"currentColor\" d=\"M8 3a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zm10 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2m-6 2a5 5 0 1 1-.001 10.001A5 5 0 0 1 12 7m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3\"/>"},"moon":{"body":"<path fill=\"#1C274C\" d=\"M12 22c5.523 0 10-4.477 10-10 0-.463-.694-.54-.933-.143a6.5 6.5 0 1 1-8.924-8.924C12.54 2.693 12.463 2 12 2 6.477 2 2 6.477 2 12s4.477 10 10 10\"/>"},"nuxtjs":{"body":"<g fill=\"none\" fill-rule=\"evenodd\"><path fill=\"#01C58E\" d=\"M77.891 183.615a9 9 0 0 1-.506-1.04 13.33 13.33 0 0 1-.906-7.517H15.993l89.888-158.184 29.51 51.875 8.557-15.141L118.224 8.29c-.72-1.306-5.065-8.29-12.556-8.29-3.385 0-8.237 1.466-12.182 8.397L2.425 168.5c-.773 1.386-4.532 8.664-.8 15.115 1.706 2.932 5.332 6.424 13.329 6.424H91.22c-7.944 0-11.623-3.439-13.329-6.424\"/><path fill=\"#108775\" d=\"M253.242 168.5 178.416 36.68c-.773-1.386-5.092-8.397-12.61-8.397-3.385 0-8.236 1.44-12.182 8.37l-9.676 16.955 8.61 15.14 13.329-23.59 74.027 129.9h-28.15a12.6 12.6 0 0 1-.587 6.398 8 8 0 0 1-.586 1.306l-.24.48c-3.785 6.45-11.97 6.797-13.568 6.797h44.037c1.626 0 9.783-.346 13.569-6.797 1.68-2.933 2.879-7.864-1.147-14.742\"/><path fill=\"#2F495E\" d=\"m210.351 183.242.24-.48q.35-.628.586-1.306c.745-2.047.947-4.25.587-6.398a19.5 19.5 0 0 0-2.453-6.558l-56.7-99.751-8.663-15.141-8.61 15.14L78.664 168.5a20.2 20.2 0 0 0-2.185 6.558 13.33 13.33 0 0 0 .826 7.517q.22.536.506 1.04c1.706 2.932 5.332 6.424 13.329 6.424h105.563c1.679 0 9.863-.346 13.648-6.797M143.948 83.89l51.822 91.168H92.153z\"/></g>","top":-32.5,"width":256,"height":256},"reading":{"body":"<path fill=\"#212121\" d=\"M8.99 2.5c1.148 0 2.231.467 3.015 1.267A4.22 4.22 0 0 1 15.02 2.5h3.735a.75.75 0 0 1 .75.75v.754h1.75a.75.75 0 0 1 .743.649l.007.102V20.25a.75.75 0 0 1-.649.743l-.101.007h-18.5a.75.75 0 0 1-.743-.648l-.007-.102V4.755a.75.75 0 0 1 .648-.744l.102-.006 1.749-.001V3.25a.75.75 0 0 1 .649-.743l.101-.007zM4.503 5.504h-1V19.5h7.444a2.87 2.87 0 0 0-1.98-.993l-.195-.007H5.254a.75.75 0 0 1-.743-.648l-.007-.102zm15 12.246a.75.75 0 0 1-.75.75h-3.518c-.845 0-1.637.372-2.175 1h7.444V5.504h-1zM18.007 3.999 15.02 4l-.194.007c-.837.06-1.6.503-2.071 1.205v12.565l.023-.017a4.35 4.35 0 0 1 2.458-.76l2.77-.001V4.798l-.003-.043.003-.045zM8.989 4l-2.985-.001.002.756-.002.028v12.216l2.77.001c.802 0 1.572.22 2.239.62l.24.156V5.211a2.73 2.73 0 0 0-1.878-1.184l-.192-.02z\"/>"},"sun":{"body":"<g fill=\"#1C274C\"><path d=\"M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0\"/><path fill-rule=\"evenodd\" d=\"M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75M4.399 4.399a.75.75 0 0 1 1.06 0l.393.392a.75.75 0 0 1-1.06 1.061l-.393-.393a.75.75 0 0 1 0-1.06m15.202 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 0 1-1.06-1.06l.393-.393a.75.75 0 0 1 1.06 0M1.25 12a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m19 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75m-2.102 6.148a.75.75 0 0 1 1.06 0l.393.393a.75.75 0 1 1-1.06 1.06l-.393-.393a.75.75 0 0 1 0-1.06m-12.296 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 1 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.061 0M12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75\" clip-rule=\"evenodd\"/></g>"},"twitter":{"body":"<path fill=\"currentColor\" d=\"m2.867 3 6.87 9.818L2.733 21H5.38l5.539-6.49L15.46 21h5.911l-7.197-10.303L20.744 3H18.14l-5.143 6.01L8.8 3z\"/>"},"up-arrow":{"body":"<path fill=\"currentColor\" d=\"M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19\"/>"},"vuejs":{"body":"<path fill=\"#41B883\" d=\"M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0z\"/><path fill=\"#41B883\" d=\"m0 0 128 220.8L256 0h-51.2L128 132.48 50.56 0z\"/><path fill=\"#35495E\" d=\"M50.56 0 128 133.12 204.8 0h-47.36L128 51.2 97.92 0z\"/>","top":-17.5,"width":256,"height":256},"youtube":{"body":"<path fill=\"currentColor\" d=\"m5.68 2 1.478 5.344v2.562H8.44V7.344L9.938 2H8.646L8.11 4.432a27 27 0 0 0-.29 1.515h-.04q-.094-.631-.29-1.525L6.97 2zm5.752 2.018q-.65-.001-1.051.257-.4.259-.59.825-.187.565-.187 1.498v.84q0 .922.164 1.478.165.556.556.82t1.078.264q.67 0 1.06-.26.391-.258.565-.818.174-.561.174-1.485v-.84q0-.93-.178-1.492-.179-.56-.566-.824t-1.025-.263m2.447.113v4.314q0 .801.271 1.178.273.377.848.377.829 0 1.244-.8h.028l.113.706H17.4V4.131h-1.298v4.588a.64.64 0 0 1-.23.263.57.57 0 0 1-.325.104q-.198 0-.283-.164-.086-.165-.086-.553V4.131zm-2.477.781q.274 0 .383.287t.108.91v1.8q0 .64-.108.923-.109.282-.38.283-.274 0-.378-.283t-.103-.924V6.11q0-.621.107-.91.107-.286.371-.287M5 11c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2zm7.049 2h1.056v2.568h.008q.143-.279.407-.449.263-.17.566-.17.39 0 .611.207.223.207.323.668.098.462.097 1.281v.772h.002q0 1.09-.264 1.602-.262.513-.818.513-.31 0-.564-.142a.93.93 0 0 1-.383-.391h-.024l-.11.46h-.907zm-6.563.246h3.252v.885h-1.09v5.789H6.576v-5.79h-1.09zm11.612 1.705q.564 0 .867.207.3.208.426.645.123.438.123 1.209v.836h-1.836v.248q0 .47.027.703.029.234.115.342.087.107.27.107.246 0 .338-.191.09-.19.1-.635l.947.055q.007.064.007.175 0 .677-.37 1.01-.37.334-1.046.334-.81 0-1.138-.51-.327-.508-.326-1.574v-.851q0-1.098.337-1.604.339-.506 1.159-.506m-8.688.094h1.1v3.58q0 .326.072.465.071.14.238.139a.5.5 0 0 0 .276-.088.54.54 0 0 0 .193-.223v-3.873h1.1v4.875h-.862l-.093-.598h-.026q-.351.678-1.05.678-.486 0-.715-.318-.232-.319-.233-.994zm8.664.648q-.176.001-.26.104-.084.104-.11.338a7 7 0 0 0-.028.71v.35h.803v-.35q0-.468-.032-.71-.03-.243-.115-.342-.083-.1-.258-.1m-3.482.036a.42.42 0 0 0-.293.126.7.7 0 0 0-.192.327v2.767a.49.49 0 0 0 .438.256.34.34 0 0 0 .277-.127q.105-.127.149-.43.043-.301.043-.835v-.627q0-.573-.035-.883-.036-.312-.127-.444a.3.3 0 0 0-.26-.13\"/>"}},"width":24,"height":24}};

const cache = /* @__PURE__ */ new WeakMap();

const $$Astro$2 = createAstro("https://bugunlerde.com");
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Icon;
  class AstroIconError extends Error {
    constructor(message) {
      super(message);
      this.hint = "";
    }
  }
  const req = Astro2.request;
  const { name = "", title, desc, "is:inline": inline = false, ...props } = Astro2.props;
  const map = cache.get(req) ?? /* @__PURE__ */ new Map();
  const i = map.get(name) ?? 0;
  map.set(name, i + 1);
  cache.set(req, map);
  const includeSymbol = !inline && i === 0;
  let [setName, iconName] = name.split(":");
  if (!setName && iconName) {
    const err = new AstroIconError(`Invalid "name" provided!`);
    throw err;
  }
  if (!iconName) {
    iconName = setName;
    setName = "local";
    if (!icons[setName]) {
      const err = new AstroIconError('Unable to load the "local" icon set!');
      throw err;
    }
    if (!(iconName in icons[setName].icons)) {
      const err = new AstroIconError(`Unable to locate "${name}" icon!`);
      throw err;
    }
  }
  const collection = icons[setName];
  if (!collection) {
    const err = new AstroIconError(`Unable to locate the "${setName}" icon set!`);
    throw err;
  }
  const iconData = getIconData(collection, iconName ?? setName);
  if (!iconData) {
    const err = new AstroIconError(`Unable to locate "${name}" icon!`);
    throw err;
  }
  const id = `ai:${collection.prefix}:${iconName ?? setName}`;
  if (props.size) {
    props.width = props.size;
    props.height = props.size;
    delete props.size;
  }
  const renderData = iconToSVG(iconData);
  const normalizedProps = { ...renderData.attributes, ...props };
  const normalizedBody = renderData.body;
  const { viewBox } = normalizedProps;
  if (includeSymbol) {
    delete normalizedProps.viewBox;
  }
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(normalizedProps)}${addAttribute(name, "data-icon")}> ${title && renderTemplate`<title>${title}</title>`} ${desc && renderTemplate`<desc>${desc}</desc>`} ${inline ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "id": id }, { "default": ($$result2) => renderTemplate`${unescapeHTML(normalizedBody)}` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${includeSymbol && renderTemplate`<symbol${addAttribute(id, "id")}${addAttribute(viewBox, "viewBox")}>${unescapeHTML(normalizedBody)}</symbol>`}<use${addAttribute(`#${id}`, "href")}></use> ` })}`} </svg>`;
}, "/var/www/html/bugunlerden/node_modules/astro-icon/components/Icon.astro", undefined);

const _sfc_main = {
  data() {
    return {
      percent: 0,
      showButton: false,
      showPercentage: true, // Yüzdeyi göstermek için kontrol
    };
  },
  methods: {
    updateProgress() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      // Kaydırma yüzdesini hesapla
      this.percent = Math.floor((scrollTop / scrollHeight) * 100);
      this.showButton = scrollTop > 200; // 200px yukarı çık butonunu göster
      this.showPercentage = true; // Yüzdeyi göstermek için
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Yumuşak kaydırma
      });
    },
  },
  computed: {
    calculatedWidth() {
      // Kaydırma yüzdesine göre container içinde ilerleme çubuğunun genişliğini hesapla
      return (this.percent / 100) * this.containerWidth;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.updateProgress);
    this.updateProgress();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.updateProgress);
  },
};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  if ($data.showButton) {
    _push(`<div class="fixed bottom-[10px] right-6 flex flex-col p-2 bg-[#fff] dark:bg-[#141414]"><div class="text-xs text-black dark:text-gray-200 font-bold flex items-center justify-center mb-1">${ssrInterpolate($data.percent)}%</div><div><button class="flex justify-center items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition" aria-label="Scroll to top"><span class="text-lg font-bold text-black dark:text-gray-200">↑</span></button></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/ScrollProgress.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const ScrollProgress = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender]]);

const $$SosyalMedya = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center px-4"> <a href="https://www.facebook.com/profile.php?id=61571630070298" target="_blank">${renderComponent($$result, "Icon", $$Icon, { "name": "facebook", "class": "p-0.5 mr-2 text-[22px] rounded text-[#000] bg-[#d7b82b] hover:shadow-none shadow-sm shadow-slate-700/50 transition-all ease-in-out duration-300" })}</a> ${renderComponent($$result, "Icon", $$Icon, { "name": "youtube", "class": "p-0.5 mr-2 text-[22px] rounded text-[#000] bg-[#d7b82b] hover:shadow-none shadow-sm shadow-slate-700/50 transition-all ease-in-out duration-300" })} <a href="https://x.com/Bugunlerdecom" target="_blank">${renderComponent($$result, "Icon", $$Icon, { "name": "twitter", "class": "p-0.5 mr-2 text-[22px] rounded text-[#000] bg-[#d7b82b] hover:shadow-none shadow-sm shadow-slate-700/50 transition-all ease-in-out duration-300" })}</a> ${renderComponent($$result, "Icon", $$Icon, { "name": "instagram", "class": "p-0.5 text-[22px] rounded text-[#000] bg-[#d7b82b] hover:shadow-none shadow-sm shadow-slate-700/50 transition-all ease-in-out duration-300" })} </div>`;
}, "/var/www/html/bugunlerden/src/components/SosyalMedya.astro", undefined);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://bugunlerde.com");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const categories = await fetchCategories();
  return renderTemplate(_a || (_a = __template(["", '<div class="left-0 sticky top-0 w-full z-50 dark:bg-[#141414]"> <!-- Desktop Layout --> <div id="header" class="gap-2 max-md:hidden max-w-screen-xl mx-auto h-[70px] flex justify-between items-center bg-[#f9d73a] dark:shadow-none shadow-lg shadow-slate-500/50 transition-all ease-in-out duration-500"> ', ' <!-- Logo and Title --> <div class="basis-1/5 px-4 flex items-center"> <span class="baslik text-lg text-[#171543] font-black whitespace-nowrap"> <h1 class="baslik" translate="no"> <a href="/"> <span>B</span><span>U</span><span>G</span><span>U</span><span>N</span><span>L</span><span>E</span><span>R</span><span>D</span><span>E</span>.\n<span class="bg-[#d7b82b] py-1 px-1 shadow-sm mx-0.2">C</span> <span class="bg-[#d7b82b] py-1 px-1 shadow-sm mx-0.2">O</span> <span class="bg-[#d7b82b] py-1 px-1 shadow-sm mx-0.2">M</span> </a> </h1> </span> </div> <!-- Categories --> <div class="basis-3/5 flex justify-center h-full"> <div class="flex text-lg space-x-3"> ', ' </div> </div> <!-- Social Media Buttons --> <div class="basis-1/5 flex justify-end items-center"> <button type="button" class="theme-toggle h-2 w-8 bg-[#000] dark:bg-[#000] flex items-center justify-start dark:justify-end transition-colors duration-100" aria-checked="false" aria-label="Toggle Dark Mode"> <span class="sr-only">Toggle Dark Mode</span> <span class="w-5 h-5 bg-[#d7b82b] transform transition-transform duration-200 translate-x-0 dark:translate-x-1 ease-in"> <span class="absolute inset-0 flex items-center justify-center opacity-100 dark:opacity-0 transition-opacity duration-200"> <!-- Sun Icon (Light Mode) --> ', ' </span> <span class="absolute inset-0 flex items-center justify-center opacity-0 dark:opacity-100 transition-opacity duration-200"> <!-- Moon Icon (Dark Mode) --> ', " </span> </span> </button> ", ' </div> </div> <!-- Mobile Layout --> <div class="md:hidden max-w-screen-md mx-auto h-[60px] bg-white dark:bg-[#141414] flex justify-between items-center px-4"> <div> <button type="button" class="theme-toggle h-2 w-8 bg-[#000] dark:bg-[#000] flex items-center justify-start dark:justify-end transition-colors duration-100" aria-checked="false" aria-label="Toggle Dark Mode"> <span class="sr-only">Toggle Dark Mode</span> <span class="w-5 h-5 bg-[#d7b82b] transform transition-transform duration-200 translate-x-0 dark:translate-x-1 ease-in"> <span class="absolute inset-0 flex items-center justify-center opacity-100 dark:opacity-0 transition-opacity duration-200"> <!-- Sun Icon (Light Mode) --> ', ' </span> <span class="absolute inset-0 flex items-center justify-center opacity-0 dark:opacity-100 transition-opacity duration-200"> <!-- Moon Icon (Dark Mode) --> ', ' </span> </span> </button> </div> <div> <span class="baslik text-sm text-[#171543] dark:text-white font-black whitespace-nowrap animate-charcter"> <h1> <a href="/"> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">B</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">U</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">G</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">U</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">N</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">L</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">E</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">R</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">D</span> <span class="bg-[#d7b82b] text-[#141414] py-1 px-1 shadow-sm mx-0.2">E</span> </a> </h1> </span> </div> <div>', '</div> </div> </div> <script src="/js/theme.js" defer><\/script> <script defer>\n  const header = document.getElementById("header");\n  let lastScrollTop = 0; // Previous scroll position\n  let scrollAmount = 0;  // Track scroll amount\n\n  window.addEventListener("scroll", () => {\n    const scrollTop = window.scrollY; // Current scroll position\n\n    // Calculate scroll amount\n    if (scrollTop > lastScrollTop) {\n      // Scrolling down\n      scrollAmount += scrollTop - lastScrollTop;\n    } else {\n      // Scrolling up\n      scrollAmount -= lastScrollTop - scrollTop;\n    }\n\n    // If scroll amount exceeds 150px, shrink header\n    if (scrollAmount > 150) {\n      header.classList.add("h-[50px]");\n      header.classList.remove("h-[70px]");\n    } else {\n      header.classList.remove("h-[50px]");\n      header.classList.add("h-[70px]"); // Restore original height\n    }\n\n    // Update last scroll position\n    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;\n  });\n<\/script>'])), maybeRenderHead(), renderComponent($$result, "ScrollProgress", ScrollProgress, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/var/www/html/bugunlerden/src/components/ScrollProgress.vue", "client:component-export": "default" }), categories.map((category) => renderTemplate`<div class="relative group flex items-center"> <a${addAttribute(`/category/${category.slug}`, "href")} class="flex items-center px-4 h-full text-[12px] baslik group-hover:text-red-600 font-bold uppercase text-black relative"> ${category.children.length > 0 && renderTemplate`<span class="mr-1 transition-transform text-md group-hover:rotate-90 duration-500 ease-in-out">+</span>`} ${category.name} </a> ${category.children.length > 0 && renderTemplate`<div class="absolute top-full left-4 min-w-[200px] flex flex-col bg-red-600 px-4 py-2 opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.25,_0.8,_0.25,_1)] translate-y-10 shadow-lg shadow-slate-500/50 dark:shadow-none"> <span class="absolute top-[0.2px] left-6 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45 transform origin-center"></span> <div class="flex flex-col pb-2 space-y-1 text-white"> ${category.children.map((subCategory, index) => renderTemplate`<a${addAttribute(`/category/${subCategory.slug}`, "href")}${addAttribute(`text-[11px] baslik font-bold uppercase hover:text-[#f9d73a] transition-transform duration-300 ease-in-out translate-y-5 group-hover:translate-y-0 transition-opacity opacity-0 group-hover:opacity-100`, "class")}${addAttribute({ transitionDelay: `${index * 70}ms` }, "style")}> ${subCategory.name} </a>`)} </div> </div>`} </div>`), renderComponent($$result, "Icon", $$Icon, { "name": "sun", "class": "p-0.5 text-[22px] rounded text-[#fff] bg-[#d7b82b] shadow-sm shadow-slate-600/50" }), renderComponent($$result, "Icon", $$Icon, { "name": "moon", "class": "p-0.5 text-[22px] rounded text-[#fff] bg-[#d7b82b] shadow-sm shadow-slate-600/50" }), renderComponent($$result, "SosyalMedya", $$SosyalMedya, {}), renderComponent($$result, "Icon", $$Icon, { "name": "sun", "class": "p-0.5 text-[22px] rounded text-[#fff] bg-[#d7b82b] shadow-sm shadow-slate-600/50" }), renderComponent($$result, "Icon", $$Icon, { "name": "moon", "class": "p-0.5 text-[22px] rounded text-[#fff] bg-[#d7b82b] shadow-sm shadow-slate-600/50" }), renderComponent($$result, "MobileMenu", MobileMenu, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/var/www/html/bugunlerden/src/components/MobileMenu.vue", "client:component-export": "default" }));
}, "/var/www/html/bugunlerden/src/components/Header.astro", undefined);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="bg-[#141414] mt-[100px] max-w-screen-xl mx-auto"> <!-- FOOTER --> <div class="baslik flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between items-center border-t border-gray-800 py-6 text-center text-xs text-gray-500 px-6"> <!-- Sol Taraf: Linkler --> <div class="flex flex-row space-x-6"> <a href="/hakkimizda" class="hover:text-white transition">Hakkımızda</a> <a href="/gizlilik-politikasi" class="hover:text-white transition">Gizlilik Politikası</a> <a href="/reklam" class="hover:text-white transition">Reklam</a> </div> <!-- Orta: Başlık --> <div> <h1 translate="no" class="text-white text-2xl font-bold"> <a href="/">BUGUNLERDE.COM</a></h1> </div> <!-- Sağ Taraf: Linkler --> <div class="flex flex-row space-x-6"> <a href="#" class="hover:text-white transition">Çerez Tercihleri</a> <a href="/kullanim-kosullari" class="hover:text-white transition">Kullanım Koşulları</a> <a href="#" class="hover:text-white transition">İletişim</a> </div> </div> </div>`;
}, "/var/www/html/bugunlerden/src/components/Footer.astro", undefined);

const $$Astro = createAstro("https://bugunlerde.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description, slug, image } = Astro2.props;
  return renderTemplate`<html lang="tr"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | BUGUNLERDE.COM</title><meta name="description"${addAttribute(description, "content")}><!-- Open Graph Meta Etiketleri --><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(slug, "content")}><meta property="og:image"${addAttribute(image, "content")}><meta property="og:type" content="article"><!-- Twitter Card Etiketleri --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(image, "content")}><link rel="sitemap" href="/sitemap-index.xml">${renderHead()}</head> <body> <div id="sayfa"> ${renderComponent($$result, "Header", $$Header, {})} <div class="max-w-screen-xl mx-auto"> ${renderSlot($$result, $$slots["default"])} </div> ${renderComponent($$result, "Footer", $$Footer, {})} </div> </body></html>`;
}, "/var/www/html/bugunlerden/src/layouts/layout.astro", undefined);

export { $$Layout as $, _export_sfc as _, fetchAuthors as a, fetchPostsByCategory as b, fetchCategori as c, decodeBase64Id as d, $$SosyalMedya as e, fetchPostsByAuthor as f, getPostBySlug as g, fetchRelatedPosts as h, getAllPostSlugs as i, $$Icon as j, fetchPosts as k };
