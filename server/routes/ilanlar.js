const express = require('express')
const router = express.Router()
const Ilan = require('../models/Ilan')
const auth = require('../middleware/auth')

// Tüm ilanları getir (Keşfet sayfası için)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = '', il = '', showSold = 'true' } = req.query
    
    // Filtreleme kriterleri
    const filter = {}
    
    // Arama filtresi
    if (search) {
      filter.$or = [
        { baslik: { $regex: search, $options: 'i' } },
        { aciklama: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Kategori filtresi
    if (category) {
      filter.kategori = category
    }
    
    // İl filtresi
    if (il) {
      filter.il = il
    }
    
    // Satılan ilanları göster/gizle
    if (showSold === 'false') {
      filter.satildi = false
    }
    
    // Sayfalama
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // İlanları getir
    const ilanlar = await Ilan.find(filter)
      .populate('sahibi', 'ad soyad')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
    
    // Toplam ilan sayısı
    const totalIlanlar = await Ilan.countDocuments(filter)
    const totalPages = Math.ceil(totalIlanlar / parseInt(limit))
    
    res.json({
      success: true,
      ilanlar,
      totalIlanlar,
      totalPages,
      currentPage: parseInt(page)
    })
  } catch (error) {
    console.error('İlanlar getirilirken hata:', error)
    res.status(500).json({ 
      success: false, 
      message: 'İlanlar yüklenirken bir hata oluştu' 
    })
  }
})

// Tekil ilan detayını getir
router.get('/:id', async (req, res) => {
  try {
    const ilan = await Ilan.findById(req.params.id)
      .populate('sahibi', 'ad soyad')
    
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
  } catch (error) {
    console.error('İlan detayı getirilirken hata:', error)
    res.status(500).json({ 
      success: false, 
      message: 'İlan detayı yüklenirken bir hata oluştu' 
    })
  }
})

// Kullanıcının ilanlarını getir
router.get('/benim-ilanlarim', auth, async (req, res) => {
  try {
    const ilanlar = await Ilan.find({ sahibi: req.user._id })
    res.json(ilanlar)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

// Yeni ilan oluştur
router.post('/', auth, async (req, res) => {
  try {
    console.log('İlan ekleme isteği alındı:', {
      userId: req.user._id,
      body: req.body
    })

    // Veri doğrulama
    const { baslik, aciklama, fiyat, konum, kategori, resimler, iletisim, il } = req.body

    if (!baslik || !aciklama || !fiyat || !konum || !kategori || !iletisim) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen tüm gerekli alanları doldurun'
      })
    }

    // Yeni ilan oluştur
    const ilan = new Ilan({
      baslik,
      aciklama,
      fiyat: Number(fiyat),
      konum,
      il,
      kategori,
      iletisim,
      resimler: resimler || [],
      kullaniciAdi: `${req.user.ad} ${req.user.soyad}`,
      kullaniciId: req.user._id,
      sahibi: req.user._id,
      satildi: false,
      tarih: new Date()
    })

    await ilan.save()
    
    console.log('İlan başarıyla kaydedildi:', ilan._id)
    
    res.status(201).json({
      success: true,
      message: 'İlan başarıyla eklendi',
      ilan
    })
  } catch (error) {
    console.error('İlan ekleme hatası:', error)
    
    // Mongoose validation hatası kontrolü
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veri formatı',
        errors: Object.values(error.errors).map(err => err.message)
      })
    }

    res.status(500).json({ 
      success: false,
      message: 'İlan eklenirken bir hata oluştu',
      error: error.message 
    })
  }
})

// İlan güncelle
router.put('/:id', auth, async (req, res) => {
  try {
    const ilan = await Ilan.findOne({ _id: req.params.id, sahibi: req.user._id })
    if (!ilan) {
      return res.status(404).json({ message: 'İlan bulunamadı' })
    }

    Object.assign(ilan, req.body)
    await ilan.save()
    res.json(ilan)
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

// İlan sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const ilan = await Ilan.findOneAndDelete({ _id: req.params.id, sahibi: req.user._id })
    if (!ilan) {
      return res.status(404).json({ message: 'İlan bulunamadı' })
    }
    res.json({ message: 'İlan silindi' })
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

module.exports = router 