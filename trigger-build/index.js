import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const app = express();
app.use(express.json());

// Promisify exec for better error handling
const execPromise = promisify(exec);

// Astro Build İşlemini Tetikleyen Route
app.post('/trigger-build', async (req, res) => {
    console.log('Webhook tetiklendi: Yeni yazı oluşturuldu.');

    try {
        // 1. Build işlemi
        console.log('Astro.js build işlemi başlıyor...');
        const { stdout: buildOutput } = await execPromise('npm run build', {
            cwd: '/var/www/html/bugunlerden', // Doğrudan çalışma dizinini ayarla
        });
        console.log('Build tamamlandı:\n', buildOutput);

        // 2. Dosya taşıma işlemleri
        console.log('Dosya işlemleri başlıyor...');
        const { stdout: fileOutput } = await execPromise(
            'rm -rf /var/www/html/bugunlerden/dist/* && mv /var/www/html/bugunlerden/temp/* /var/www/html/bugunlerden/dist/'
        );
        console.log('Dosya işlemleri tamamlandı:\n', fileOutput);

        res.status(200).send('Build ve dosya taşıma işlemleri tamamlandı.');
    } catch (error) {
        console.error('Hata:', error.message);
        res.status(500).send(`Bir hata oluştu: ${error.message}`);
    }
});

// Sunucu Başlatma
app.listen(3000, () => console.log('Webhook sunucusu çalışıyor: http://localhost:3000'));
