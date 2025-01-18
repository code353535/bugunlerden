<template>
    <div v-if="showPopup" class="gdpr-popup">
      <div class="popup-content">
        <p class="popup-text">
          Sitemizdeki deneyiminizi geliştirmek amacıyla veri toplamak için çerezleri (ve diğer benzer teknolojileri) kullanırız. Web sitemizi kullanarak, Gizlilik Politikamızda açıklanan şekilde veri toplanmasını kabul etmiş olursunuz.
        </p>
        <div class="buttons">
          <button @click="acceptConsent" class="accept-btn">Onayla</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const showPopup = ref(false);
  
  // Haftalık onay kontrolü
  const checkConsent = () => {
    const storedConsentDate = localStorage.getItem('gdprConsentDate');
    const currentDate = new Date();
    
    // Eğer onay tarihi yoksa veya bir haftadan eskiyse, popup'ı göster
    if (!storedConsentDate || (currentDate - new Date(storedConsentDate)) > 7 * 24 * 60 * 60 * 1000) {
      showPopup.value = true;
    } else {
      showPopup.value = false;
    }
  };
 
  onMounted(() => {
  setTimeout(() => {
    showPopup.value = true;
    checkConsent();
  }, 2000);
});

  // Kullanıcı onayını kaydet
  const acceptConsent = () => {
    const currentDate = new Date();
    localStorage.setItem('gdprConsent', 'accepted');
    localStorage.setItem('gdprConsentDate', currentDate.toISOString()); // Onay tarihini kaydet
    showPopup.value = false; // Popup'ı kapat
  };
  </script>
  
  <style scoped>
  .gdpr-popup {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #000;
    color: white;
    padding: 20px;
    text-align: center;
    z-index: 9999;
    opacity: 0.9;
    width: 60%;
    max-width: 500px;
    border-radius: 2px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    animation: slideUp 1s ease-in-out;
  }
  
  .popup-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .popup-text {
    font-size: 13px;
    margin-bottom: 20px;
    font-weight: 300;
    line-height: 1.5;
  }
  
  .buttons {
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 8px 10px;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
  }
  
  .accept-btn {
    background-color: #d7b82b;
    color: black;
  }
  
  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  
  