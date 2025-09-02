const express = require('express')
const router = express.Router()
const Ilan = require('../models/Ilan')
const User = require('../models/User')

// Admin middleware - basit token kontrolü
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token === 'admin-auth-token') {
    next()
  } else {
    res.status(401).json({ success: false, message: 'Yetkisiz erişim' })
  }
}

// Tüm ilanları getir
router.get('/ilanlar', adminAuth, async (req, res) => {
  try {
    const ilanlar = await Ilan.find().populate('kullanici', 'ad soyad email')
    res.json({ success: true, ilanlar })
  } catch (error) {
    res.status(500).json({ success: false, message: 'İlanlar yüklenirken hata oluştu' })
  }
})

// Tüm kullanıcıları getir
router.get('/kullanicilar', adminAuth, async (req, res) => {
  try {
    const kullanicilar = await User.find().select('-sifre')
    res.json({ success: true, kullanicilar })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kullanıcılar yüklenirken hata oluştu' })
  }
})

// İlan sil
router.delete('/ilan-sil', adminAuth, async (req, res) => {
  try {
    const { id } = req.body
    const ilan = await Ilan.findByIdAndDelete(id)
    if (!ilan) {
      return res.status(404).json({ success: false, message: 'İlan bulunamadı' })
    }
    res.json({ success: true, message: 'İlan başarıyla silindi' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'İlan silinirken hata oluştu' })
  }
})

// Kullanıcı sil
router.delete('/kullanici-sil', adminAuth, async (req, res) => {
  try {
    const { id } = req.body
    const kullanici = await User.findByIdAndDelete(id)
    if (!kullanici) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' })
    }
    
    // Kullanıcının ilanlarını da sil
    await Ilan.deleteMany({ kullanici: id })
    
    res.json({ success: true, message: 'Kullanıcı ve ilanları başarıyla silindi' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kullanıcı silinirken hata oluştu' })
  }
})

// Toplu ilan sil
router.delete('/ilanlar-sil', adminAuth, async (req, res) => {
  try {
    const { ids } = req.body
    await Ilan.deleteMany({ _id: { $in: ids } })
    res.json({ success: true, message: 'İlanlar başarıyla silindi' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'İlanlar silinirken hata oluştu' })
  }
})

// Toplu kullanıcı sil
router.delete('/kullanicilar-sil', adminAuth, async (req, res) => {
  try {
    const { ids } = req.body
    await User.deleteMany({ _id: { $in: ids } })
    await Ilan.deleteMany({ kullanici: { $in: ids } })
    res.json({ success: true, message: 'Kullanıcılar ve ilanları başarıyla silindi' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kullanıcılar silinirken hata oluştu' })
  }
})

// İlan öne çıkar
router.put('/ilan-one-cikar', adminAuth, async (req, res) => {
  try {
    const { id } = req.body
    const ilan = await Ilan.findById(id)
    if (!ilan) {
      return res.status(404).json({ success: false, message: 'İlan bulunamadı' })
    }
    
    ilan.oneCikarilmis = !ilan.oneCikarilmis
    await ilan.save()
    
    res.json({ 
      success: true, 
      message: ilan.oneCikarilmis ? 'İlan öne çıkarıldı' : 'İlan öne çıkarma kaldırıldı' 
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'İşlem sırasında hata oluştu' })
  }
})

// Kullanıcı engelle/engelini kaldır
router.put('/kullanici-engelle', adminAuth, async (req, res) => {
  try {
    const { id } = req.body
    const kullanici = await User.findById(id)
    if (!kullanici) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' })
    }
    
    kullanici.engellendi = !kullanici.engellendi
    await kullanici.save()
    
    res.json({ 
      success: true, 
      message: kullanici.engellendi ? 'Kullanıcı engellendi' : 'Kullanıcı engeli kaldırıldı' 
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'İşlem sırasında hata oluştu' })
  }
})

// İstatistikler
router.get('/istatistikler', adminAuth, async (req, res) => {
  try {
    const totalIlanlar = await Ilan.countDocuments()
    const totalKullanicilar = await User.countDocuments()
    const aktifIlanlar = await Ilan.countDocuments({ satildi: false })
    const satilanIlanlar = await Ilan.countDocuments({ satildi: true })
    const oneCikarilanIlanlar = await Ilan.countDocuments({ oneCikarilmis: true })
    const engellenenKullanicilar = await User.countDocuments({ engellendi: true })

    res.json({
      success: true,
      stats: {
        totalIlanlar,
        totalKullanicilar,
        aktifIlanlar,
        satilanIlanlar,
        oneCikarilanIlanlar,
        engellenenKullanicilar
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'İstatistikler yüklenirken hata oluştu' })
  }
})

module.exports = router
