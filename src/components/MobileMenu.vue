<template>
    <!-- Menü İkonu -->
    <button @click="toggleMenu" aria-label="Menüyü Aç/Kapat" class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-7 h-7 text-black dark:text-white">
        <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  
    <!-- Mobil Menu Başlangıç -->
    <transition name="slider">
      <div v-if="MobilMenu" class="fixed inset-0 z-50 flex">
        <div class="bg-[#fff] dark:bg-black  text-black dark:text-gray-100 w-full p-4">
          <div class="flex justify-between border-b border-[#e6e6e5] dark:border-[#2d2d2d]">
            <div class="pb-4 flex flex-row items-center min-h-12">
              <span class="baslik text-xl font-black whitespace-nowrap animate-charcter">
                BUGUNLERDE
              </span>
            </div>
            <div>
              <button @click="MobilMenu = false" class="text-black focus:outline-none mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="font-bold w-6 h-6 text-black dark:text-gray-100">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
  
          <nav class="mt-6 text-black dark:text-gray-100">
            <div v-for="category in categories" :key="category.id">
              <div class="group mb-4 mx-2 mt-6 border-b-2 border-dotted border-gray-600-">
                <!-- Main Category Click to Navigate and Toggle Subcategories -->
                <div @click="category.subcategories.length > 0 ? toggleCategory(category.id) : navigateToCategory(category.slug)" class="flex items-center cursor-pointer">
                  <span class="flex text-lg  tracking-wide font-bold uppercase">
                    <a v-if="category.subcategories.length === 0" :href="`/category/${category.slug}`">
                        {{ category.name }}
                      </a>
                      <span v-else>
                        <div class="flex items-center">
                        {{ category.name }}
                        <!-- Add down-arrow for categories with subcategories -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 w-5 h-5 transition-transform" :class="{'rotate-180': selectedCategory === category.id}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
                      </span>
                    </span>
                </div>
  
                <!-- Show subcategories when clicked -->
                <transition name="slide" @before-leave="beforeLeave">
                  <div v-if="selectedCategory === category.id" class="mt-4 font-bold tracking-wide text-lg uppercase">
                    <div v-for="(subcategory, index) in category.subcategories" :key="subcategory.id" :style="{ animationDelay: `${index * 0.1}s` }" class="subcategory-item mb-3">
                      <a
                        :href="`/category/${subcategory.slug}`"
                        class="flex items-center px-4 text-lg font-bold uppercase"
                      >
                        {{ subcategory.name }}  <!-- Display subcategory name -->
                      </a>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </nav>
        </div>
        <div class="flex-grow" @click="MobilMenu = false"></div>
      </div>
    </transition>
    <!-- Mobil Menu Son -->
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';

// Menü Durumu
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
    const response = await fetch('https://bugunlerde.com/api/wordpress/wp-json/wp/v2/categories?per_page=100');
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
</script>

<style scoped>
.slider-enter-active, .slider-leave-active {
    transition: opacity 0.5s cubic-bezier(0.68, -0.55, 0.27, 1), transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1);
  }
  .slider-enter-from, .slider-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
/* Transition classes for sliding effect */
.slide-enter-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.slide-leave-active {
  transition: none; /* Instant close */
}

.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateY(-20px); /* Start position for entering */
  opacity: 0;
}

/* Animation for subcategory items with a delay for sequential reveal */
.subcategory-item {
  opacity: 0;
  transform: translateY(20px); /* Start position for entering */
  transition: opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.subcategory-item:nth-child(n) {
  animation: reveal 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes reveal {
  0% {
    opacity: 0;
    transform: translateY(20px); /* Start position for entering */
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
  