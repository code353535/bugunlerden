const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Klasör yolları
const currentBuildDir = path.resolve(__dirname, 'dist');
const tempBuildDir = path.resolve(__dirname, 'temp-build');
const rollbackDir = path.resolve(__dirname, 'rollback');

try {
    console.log('Starting build process...');

    // Rollback için mevcut build klasörünü yedekle
    if (fs.existsSync(currentBuildDir)) {
        console.log('Creating rollback backup...');
        if (fs.existsSync(rollbackDir)) {
            fs.rmdirSync(rollbackDir, { recursive: true });
        }
        fs.renameSync(currentBuildDir, rollbackDir);
        console.log('Rollback backup created successfully.');
    }

    // Geçici build klasörü oluştur
    if (fs.existsSync(tempBuildDir)) {
        fs.rmdirSync(tempBuildDir, { recursive: true });
    }

    // Build işlemini geçici klasöre al
    console.log('Running build into temp directory...');
    execSync('npm run build-temp', { stdio: 'inherit' });

    // Yeni build'i mevcut build klasörüyle değiştir
    console.log('Replacing current build with new build...');
    fs.renameSync(tempBuildDir, currentBuildDir);

    console.log('Build process completed successfully!');

    // Rollback klasörünü temizle (artık gerek yok)
    if (fs.existsSync(rollbackDir)) {
        fs.rmdirSync(rollbackDir, { recursive: true });
        console.log('Rollback backup removed.');
    }
} catch (err) {
    console.error('Build process failed:', err.message);

    // Hata durumunda rollback
    if (fs.existsSync(rollbackDir)) {
        console.log('Restoring previous build from rollback...');
        if (fs.existsSync(currentBuildDir)) {
            fs.rmdirSync(currentBuildDir, { recursive: true });
        }
        fs.renameSync(rollbackDir, currentBuildDir);
        console.log('Rollback completed successfully.');
    } else {
        console.error('No rollback available. Current build is invalid.');
    }
}
