<template>
  
    <section class="grid grid-cols-1 md:grid-cols-4 gap-8 min-h-16 mt-8 md:px-0 px-4">
      <div v-for="post in filteredPosts" :key="post.id" id="remainingPosts" class="md:col-span-3 grid grid-cols-1 gap-8">
        <div class="flex flex-col md:flex-row md:items-stretch">
          <div class="relative w-full md:w-1/3 h-[250px] md:h-auto overflow-hidden group">
                <a v-if="post.imageUrl" :href="`/post/${post.slug}`">
                  <img
                    :src="post.imageUrl"
                    :alt="post.altText"
                    loading="lazy"
                    class="w-full object-center md:object-top max-h-[250px] min-h-[250px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
              </div>
      
              <!-- İçerik alanı -->
              <div class="relative flex flex-col justify-between p-4 dark:bg-[#212121] bg-gray-100 md:w-2/3">
                <h2 class="text-md md:text-xl baslik font-semibold">
                  <a :href="`/post/${post.slug}`" class="olink">{{ post.title }}</a>
                </h2>
                <p v-html="truncateText(post.excerpt, 120)" class="max-md:my-2"></p>
                <div class="flex justify-between items-center mt-4">
                  <div class="text-xs">
                    <span class="inline-block font-semibold text-gray-500">
                      <div class="flex items-center">
                        <img
                          v-if="post.authorAvatar"
                          :src="post.authorAvatar"
                          :alt="`${post.author} avatar`"
                          class="w-6 h-6 rounded-full mr-2"
                        />
                        <div class="text-sm">
                          <span
                          class="inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white bg-gray-200 px-1 py-1"
                        >
                          <a :href="`/category/${post.categorySlug}`">
                            {{ post.category }}
                        </a>
                        </span>
                        </div>
                      </div>
                    </span>
                  </div>
                  <!-- Tarih -->
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
        
    </section>
    
    <div class="flex justify-center items-center w-full my-8">
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
      </script>
      
      <style scoped>
        
      </style>
      