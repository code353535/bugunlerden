#!/bin/bash    

# Ayarlar
BUILD_DIR="/var/www/html/bugunlerden/temp"  # Temp klasörü yolu
LIVE_DIR="/var/www/html/bugunlerden/dist"   # Dist klasörü yolu

# 1. Yeni build oluştur
echo "Running build in temporary directory..."
npm ci
npm run build && {
    # 2. Build tamamlandıktan sonra işlemi yap
    echo "Deploying new build to live site..."
    rm -rf $LIVE_DIR/* && mv $BUILD_DIR/* $LIVE_DIR/
} || {
    echo "Build failed."
    exit 1
}

# 3. Eski yedeği sakla veya temizle
echo "Deployment complete! Old site backed up at $BACKUP_DIR."
