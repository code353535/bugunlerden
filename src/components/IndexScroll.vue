<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { format, parseISO } from 'date-fns'; // format ve parseISO'yu import et
import { tr } from 'date-fns/locale';

// Tarih formatını değiştiren fonksiyon
const formatPostDate = (date) => {
  return format(new Date(date), 'dd.MM.yyyy', { locale: tr }); // 'dd.MM.yyyy' formatında döndürür
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
      const formattedDate = formatPostDate(post.date); // Yeni formatta tarih
      const selectedCategory = post.categories?.nodes?.[0];
      const categoryDescription = selectedCategory?.description || '';
      const categorySlug = selectedCategory?.slug || 'general';

      return {
        ...post,
        imageUrl: post.featuredImage?.node?.sourceUrl || null,
        altText: post.featuredImage?.node?.altText || '',
        imageTitle: post.featuredImage?.node?.title || '',
        authorId,
        formattedDate,  // Yeni tarih formatı
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
