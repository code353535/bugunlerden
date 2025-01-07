#!/bin/bash

# Ayarlar
BUILD_DIR="/var/www/html/bugunlerden/temp"           # Geçici build dizini
LIVE_DIR="/var/www/html/bugunlerden/dist"        # Canlı site dizini
BACKUP_DIR="/var/www/html/bugunlerden/backup"    # Yedekleme dizini

echo "Starting build process..."

# 1. Yeni build oluştur
echo "Running build in temporary directory..."
npm ci
npm run build 

# 2. Build işlemi tamamlandıktan sonra eski sürümü yedekle
echo "Backing up current live site..."
rm -rf $BACKUP_DIR
mv $LIVE_DIR $BACKUP_DIR

# 3. Yeni build'i canlı dizine taşı
echo "Deploying new build to live site..."
mv $BUILD_DIR/* $LIVE_DIR/

# 4. Geçici klasörü temizle
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# 5. Eski yedeği sakla veya temizle
echo "Deployment complete! Old site backed up at $BACKUP_DIR."
