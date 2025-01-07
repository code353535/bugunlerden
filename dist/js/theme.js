document.addEventListener('DOMContentLoaded', () => {
    const themeToggles = document.querySelectorAll('.theme-toggle'); // Tüm öğeleri seç
    const htmlElement = document.documentElement;

    const userTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Sayfa yüklendiğinde tema ayarını kontrol et
    if (userTheme) {
      htmlElement.classList.add(userTheme);
    } else {
      htmlElement.classList.add(systemTheme);
    }

    // Her bir tema düğmesine tıklama olayını ekle
    themeToggles.forEach((themeToggle) => {
      themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.classList.remove(currentTheme);
        htmlElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
      });
    });
  });
  