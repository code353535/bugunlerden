#!/bin/bash

# Ayarlar
BUILD_DIR="/var/www/html/bugunlerden/temp"       
LIVE_DIR="/var/www/html/bugunlerden/dist"       

echo "Starting build process..."

# 1. Yeni build oluştur
echo "Running build in temporary directory..."
npm ci
npm run build && {
# 2. change yap
    echo "Deploying new build to live site..."
    mv $BUILD_DIR/* $LIVE_DIR/
} || {
    echo "Build failed."
    exit 1
}
# . Eski yedeği sakla veya temizle
echo "Deployment complete! Old site backed up at $BACKUP_DIR."
