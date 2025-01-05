<template>
    <div id="remainingPosts" class="grid grid-cols-1 md:grid-cols-4 min-h-16 gap-4 md:gap-[10px] mt-4 md:px-0 px-4">
      <div v-for="post in filteredPosts" :key="post.id" class="col-span-1">
        <div class="flex flex-col h-full">
          <!-- Görsel alanı -->
          <div class="relative w-full h-[250px] md:h-[200px] overflow-hidden group">
            <a v-if="post.imageUrl" :href="`/post/${post.slug}`">
              <img
                :src="post.imageUrl"
                :alt="post.altText"
                loading="lazy"
                class="w-full h-[250px] md:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </a>
          </div>
  
          <!-- İçerik alanı -->
          <div class="relative flex flex-col justify-between flex-grow p-4 dark:bg-[#212121] bg-gray-100">
            <!-- Başlık -->
            <h3 class="text-md baslik font-semibold">
              <a :href="`/post/${post.slug}`" class="olink">{{ post.title }}</a>
            </h3>
            <div class="flex justify-between items-center mt-4">
                <div class="text-xs">
                      <span class="inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white  bg-gray-200 px-1 py-1">
                       <a :href="`/category/${post.categorySlug}`">
                            {{ post.category }}
                          </a>
                       
                      </span>
                    </div>

                <p class="flex justify-center text-xs text-gray-500">
                    {{ post.formattedDate }}
                </p>
              </div>
              <div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none">
                <div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div>
                <div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div>
              </div>
              <div class=" max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none">
              <div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div>
              <div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div>
                    </div>
          </div>
        </div>
      </div>
    </div>
  
    <div class="flex justify-center items-center my-8">
      <button 
        @click="loadMore" 
        v-if="hasMorePosts && !loading" 
        class="bg-red-500 px-2 py-1 cursor-pointer text-white text-sm font-semibold shadow-sm shadow-slate-500/50">
        Daha Fazla Göster
      </button>
      
      <!-- 'Yükleniyor...' yazısını buton içinde göstermek -->
      <button 
        :disabled="loading"
        @click="loadMore" 
        v-else-if="loading" 
        class="bg-red-500 px-2 py-1 text-white text-sm font-semibold shadow-sm shadow-slate-500/50">
        Yükleniyor...
      </button>
      
      <p v-else-if="!hasMorePosts"></p>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  <script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const props = defineProps({
  authorId: {
    type: String,
    required: true,
  },
});

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
    const response = await axios.post('http://localhost/graphql', {
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
</script>
