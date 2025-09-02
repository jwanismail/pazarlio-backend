# PazarLio - İkinci El Alışveriş Platformu

Türkiye'nin en güvenilir ikinci el alışveriş platformu.

## 🌐 Canlı Site
- **Frontend:** https://pazarlio.com
- **API:** https://pazarlio-api.onrender.com

## 🚀 Deployment

### Gereksinimler
- Node.js 18+
- MongoDB Atlas
- Render.com hesabı
- Domain (.com)

### Adımlar
1. **Domain Satın Alın** (GoDaddy, Namecheap vb.)
2. **Render'da Servisleri Oluşturun**
3. **Environment Variables Ayarlayın**
4. **DNS Ayarlarını Yapın**
5. **SSL Sertifikasını Bekleyin**

### Environment Variables
```env
# Backend
MONGODB_URI=mongodb+srv://civanelismail571:Hirciv19@pazarlio2.kegaoz4.mongodb.net/ilan-db?retryWrites=true&w=majority&appName=pazarLio2
JWT_SECRET=your-secret-key
PORT=10000

# Frontend
VITE_API_URL=https://pazarlio-api.onrender.com
```

## 🛠️ Geliştirme

```bash
# Frontend
cd client
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
```

## 📱 Özellikler
- ✅ Kullanıcı kayıt/giriş
- ✅ İlan ekleme/düzenleme/silme
- ✅ Arama ve filtreleme
- ✅ Çoklu dil desteği
- ✅ Responsive tasarım
- ✅ PWA desteği

## 🔧 Teknolojiler
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Deployment:** Render.com
- **Domain:** Custom .com domain

## 📞 İletişim
- Website: https://pazarlio.com
- Email: info@pazarlio.com
