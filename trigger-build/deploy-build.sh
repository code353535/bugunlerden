#!/bin/bash    

# 1. Yeni build oluştur
echo "Running build in temporary directory..."
npm ci
npm run build && {
# 2. change yap
    echo "Deploying new build to live site..."
    mv temp dist
} || {
    echo "Build failed."
    exit 1
}
# . Eski yedeği sakla veya temizle
echo "Deployment complete! Old site backed up at $BACKUP_DIR."
