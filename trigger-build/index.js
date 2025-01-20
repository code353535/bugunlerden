import express from 'express';
import { exec } from 'child_process';
import pkg from 'bull';
const { Queue, Worker } = pkg;

const app = express();
app.use(express.json());

// Job Queue oluşturuluyor
const buildQueue = new Queue('buildQueue');

// Worker yapılandırması
const worker = new Worker('buildQueue', async job => {
    console.log('Astro.js build işlemi başlıyor...');
    
    // Build işlemi
    try {
        await new Promise((resolve, reject) => {
            exec('npm run build', (error, stdout, stderr) => {
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
                        console.error(`Dosya işlemi hatası: ${stderr}`);
                        return reject(new Error('Dosya işlemi başarısız oldu'));
                    }
                    console.log('Dosya işlemleri tamamlandı.');
                    resolve();
                }
            );
        });

        console.log('Build ve dosya taşıma işlemleri tamamlandı.');
    } catch (error) {
        console.error('Hata:', error.message);
    }
});

// Webhook tetikleme route'u
app.post('/trigger-build', async (req, res) => {
    console.log('Webhook tetiklendi: Yeni yazı oluşturuldu.');

    try {
        // Yeni build işlemi job'u kuyruğa ekleniyor
        await buildQueue.add({});
        res.status(200).send('Build ve dosya taşıma işlemi kuyruğa alındı.');
    } catch (error) {
        console.error('Hata:', error.message);
        res.status(500).send('Bir hata oluştu.');
    }
});

// Sunucu başlatma
app.listen(3000, () => console.log('Webhook sunucusu çalışıyor: http://localhost:3000'));
