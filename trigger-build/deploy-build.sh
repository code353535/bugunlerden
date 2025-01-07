#!/bin/bash    



# 1. Yeni build oluştur
echo "Running build in temporary directory..."
npm ci
npm run build 

# 3. Eski yedeği sakla veya temizle
echo "Deployment complete! Old site backed up at $BACKUP_DIR."
