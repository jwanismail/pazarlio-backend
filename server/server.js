require('dotenv').config(); // .env dosyasını oku

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Ilan = require('./models/Ilan'); // İlan modelini import et
const authRoutes = require('./routes/auth'); // Auth route'larını import et
const ilanlarRoutes = require('./routes/ilanlar'); // İlanlar route'larını import et
const adminRoutes = require('./routes/admin'); // Admin route'larını import et

const app = express();

// CORS ayarları - Tüm origin'leri kabul et
app.use(cors({
  origin: true, // Tüm origin'leri kabul et
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express middleware'leri
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Auth route'larını ekle
app.use('/', authRoutes);

// İlanlar route'larını ekle
app.use('/api/ilanlar', ilanlarRoutes);

// Admin route'larını ekle
app.use('/admin', adminRoutes);

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://civanelismail571:Hirciv19@pazarlio2.kegaoz4.mongodb.net/ilan-db?retryWrites=true&w=majority&appName=pazarLio2';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('MongoDB Atlas bağlantısı başarılı')
  console.log('Bağlantı URL:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'))
})
.catch(err => {
  console.error('MongoDB Atlas bağlantısı hatası:', err)
  console.error('Bağlantı URL:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'))
})

// Test endpoint'i
app.get('/test', (req, res) => {
  res.json({ message: 'Server çalışıyor!' })
})

// Bu endpoint'i kaldırdık çünkü artık routes/ilanlar.js'teki endpoint kullanılacak

// İlanları listeleme
app.get('/api/ilanlar', async (req, res) => {
  try {
    console.log('İlanlar listeleme isteği alındı:', req.query)
    
    const { page = 1, limit = 20, search = '', category = '', showSold = true } = req.query
    
    // Arama ve filtreleme kriterleri
    const query = {}
    
    if (search) {
      query.$or = [
        { baslik: { $regex: search, $options: 'i' } },
        { aciklama: { $regex: search, $options: 'i' } },
        { konum: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (category) {
      query.kategori = category
    }
    
    if (!showSold) {
      query.satildi = false
    }

    console.log('MongoDB sorgusu:', query)

    // Toplam ilan sayısını al
    const totalIlanlar = await Ilan.countDocuments(query)
    console.log('Toplam ilan sayısı:', totalIlanlar)
    
    const totalPages = Math.ceil(totalIlanlar / limit)

    // İlanları getir
    const ilanlar = await Ilan.find(query)
      .sort({ tarih: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    console.log('Bulunan ilan sayısı:', ilanlar.length)

    res.json({
      success: true,
      ilanlar,
      totalPages,
      totalIlanlar,
      currentPage: Number(page)
    })
  } catch (error) {
    console.error('İlanları listeleme hatası - Detaylı:', {
      message: error.message,
      stack: error.stack,
      query: req.query
    })
    res.status(500).json({
      success: false,
      message: 'İlanlar listelenirken bir hata oluştu',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// İlan detayı
app.get('/api/ilanlar/:id', async (req, res) => {
  try {
    const ilan = await Ilan.findById(req.params.id)
    if (!ilan) {
      return res.status(404).json({ 
        success: false,
        message: 'İlan bulunamadı' 
      })
    }
    res.json({
      success: true,
      ilan
    })
  } catch (err) {
    console.error('İlan detayı hatası:', err)
    res.status(500).json({ 
      success: false,
      message: 'İlan detayı alınırken bir hata oluştu',
      error: err.message 
    })
  }
})

// İlan güncelleme
app.put('/api/ilanlar/:id', async (req, res) => {
  try {
    console.log('Güncelleme isteği:', {
      id: req.params.id,
      body: req.body
    });

    // Veri doğrulama
    const { baslik, aciklama, fiyat, konum, kategori, resimler, iletisim, satildi } = req.body;

    if (!baslik || !aciklama || !fiyat || !konum || !kategori || !iletisim) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen tüm gerekli alanları doldurun'
      });
    }

    // İlanı bul ve güncelle
    const ilan = await Ilan.findByIdAndUpdate(
      req.params.id,
      {
        baslik,
        aciklama,
        fiyat: Number(fiyat),
        konum,
        kategori,
        iletisim,
        resimler: resimler || [],
        satildi: satildi || false,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true // Validation'ları çalıştır
      }
    );

    if (!ilan) {
      return res.status(404).json({
        success: false,
        message: 'İlan bulunamadı'
      });
    }

    console.log('Güncellenen ilan:', ilan);

    res.json({
      success: true,
      message: 'İlan başarıyla güncellendi',
      ilan
    });
  } catch (error) {
    console.error('İlan güncelleme hatası - Detaylı:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    // Mongoose validation hatası kontrolü
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veri formatı',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'İlan güncellenirken bir hata oluştu',
      error: error.message
    });
  }
});

// İlan silme
app.delete('/api/ilanlar/:id', async (req, res) => {
  try {
    const ilan = await Ilan.findByIdAndDelete(req.params.id)
    if (!ilan) {
      return res.status(404).json({ error: 'İlan bulunamadı' })
    }
    res.json({ message: 'İlan silindi' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Kullanıcının ilanlarını getirme - kullaniciId ile
app.get('/api/ilanlar/kullanici/:kullaniciId', async (req, res) => {
  try {
    const ilanlar = await Ilan.find({ kullaniciId: req.params.kullaniciId })
      .sort({ tarih: -1 })
    
    res.json({
      success: true,
      ilanlar
    })
  } catch (error) {
    console.error('Kullanıcı ilanları getirme hatası:', error)
    res.status(500).json({
      success: false,
      message: 'İlanlar getirilirken bir hata oluştu',
      error: error.message
    })
  }
})

// Port ayarı
const PORT = process.env.PORT || 5002

// Sunucuyu başlat
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor`)
})