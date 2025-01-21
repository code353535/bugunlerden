import express from 'express';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

// Astro Build İşlemini Tetikleyen Route
app.post('/trigger-build', async (req, res) => {
    console.log('Webhook tetiklendi: Yeni yazı oluşturuldu.');

    try {
        // 1. Build işlemi
        console.log('Astro.js build işlemi başlıyor...');
        await new Promise((resolve, reject) => {
            exec('cd /var/www/html/bugunlerden && npm run build', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Build hatası: ${stderr}`);
                    return reject(new Error('Build işlemi başarısız oldu'));
                }
                console.log('Build tamamlandı:\n', stdout);
                resolve();
            });
        });

        console.log('Dosya işlemleri başlıyor...');
await new Promise((resolve, reject) => {
    exec(
        'rm -rf /var/www/html/bugunlerden/dist/* && mv /var/www/html/bugunlerden/temp/* /var/www/html/bugunlerden/dist/',
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Dosya işlemi hatası: ${stderr || error.message}`);
                return reject(new Error('Dosya işlemi başarısız oldu'));
            }
            console.log('Dosya işlemleri tamamlandı.');
            resolve();
        }
    );
});
        res.status(200).send('Build ve dosya taşıma işlemleri tamamlandı.');
    } catch (error) {
        console.error('Hata:', error.message);
        res.status(500).send('Bir hata oluştu.');
    }
});

// Sunucu Başlatma
app.listen(3000, () => console.log('Webhook sunucusu çalışıyor: http://localhost:3000'));
