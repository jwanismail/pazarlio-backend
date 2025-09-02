#!/bin/bash

echo "🚀 PazarLio Deployment Başlatılıyor..."

# Frontend build
echo "📦 Frontend build ediliyor..."
cd client
npm install
npm run build
cd ..

# Backend build
echo "🔧 Backend hazırlanıyor..."
cd server
npm install
cd ..

echo "✅ Build tamamlandı!"
echo "🌐 Render'da deployment için:"
echo "1. GitHub'a push yapın"
echo "2. Render dashboard'da servisleri kontrol edin"
echo "3. MongoDB Atlas bağlantısını kontrol edin"
echo "4. Domain ayarlarını yapın"
echo "5. SSL sertifikasının aktif olmasını bekleyin"

echo "🚀 MongoDB Atlas ile deployment hazır!" 