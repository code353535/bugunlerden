<template>
    <div>
      
      <!-- Scroll to Top Button -->
       <div v-if="showButton" class="fixed bottom-[10px] right-6 flex flex-col p-2 bg-[#fff] dark:bg-[#141414]">
        <div class="text-xs text-black dark:text-gray-200 font-bold flex items-center justify-center mb-1">{{ percent }}%</div>
        <div>
      <button
        @click="scrollToTop"
        class="flex justify-center items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition"
        aria-label="Scroll to top"
      >
        <span class="text-lg font-bold text-black dark:text-gray-200">↑</span>
      </button>
    </div>
    </div>
    </div>
  </template>
  
  <script>
export default {
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
</script>

<style scoped>

</style>
  