const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const twilio = require('twilio')

// Twilio client'ı oluştur (test için)
let twilioClient = null
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
  }
} catch (error) {
  console.log('Twilio client oluşturulamadı, test modunda çalışılıyor')
}

// Middleware - Token doğrulama
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme hatası' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pazarlio-super-secret-jwt-key-2024')
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' })
  }
}

// Kayıt için doğrulama kodu gönder
router.post('/kayit-dogrulama-kodu-gonder', async (req, res) => {
  try {
    const { ad, soyad, email, telefon, il, yurt, sifre } = req.body

    // Email kontrolü
    const existingUserByEmail = await User.findOne({ email })
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' })
    }

    // Telefon kontrolü
    const existingUserByPhone = await User.findOne({ telefon })
    if (existingUserByPhone) {
      return res.status(400).json({ message: 'Bu telefon numarası zaten kullanılıyor' })
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(sifre, salt)

    // Geçici kullanıcı oluştur (henüz kaydedilmedi)
    const tempUser = {
      ad,
      soyad,
      email,
      telefon,
      il,
      yurt,
      sifre: hashedPassword,
      dogrulamaKodu: Math.floor(100000 + Math.random() * 900000).toString(),
      dogrulamaKoduGecerlilik: new Date(Date.now() + 10 * 60 * 1000) // 10 dakika
    }

    // Geçici kullanıcı bilgilerini session'a kaydet (gerçek uygulamada Redis kullanılabilir)
    // Şimdilik basit bir çözüm olarak geçici kullanıcı bilgilerini döndürüyoruz
    res.json({
      message: 'Doğrulama kodu gönderildi',
      tempUser: {
        ad: tempUser.ad,
        soyad: tempUser.soyad,
        email: tempUser.email,
        telefon: tempUser.telefon,
        il: tempUser.il,
        yurt: tempUser.yurt,
        dogrulamaKodu: tempUser.dogrulamaKodu,
        dogrulamaKoduGecerlilik: tempUser.dogrulamaKoduGecerlilik
      },
      telefon: tempUser.telefon.replace(/(\d{3})(\d{3})(\d{4})/, '$1 *** $3')
    })

    // Test modunda console'a yazdır
    console.log(`Test modu - Kayıt doğrulama kodu: ${tempUser.dogrulamaKodu} (${tempUser.telefon} numarasına gönderildi)`)
  } catch (error) {
    console.error('Kayıt doğrulama kodu gönderme hatası:', error)
    res.status(500).json({ message: 'Doğrulama kodu gönderilemedi' })
  }
})

// Kayıt doğrulama kodu ile kayıt tamamlama
router.post('/kayit-dogrulama', async (req, res) => {
  try {
    const { ad, soyad, email, telefon, il, yurt, sifre, dogrulamaKodu, tempUser } = req.body

    // Geçici kullanıcı bilgilerini kontrol et
    if (!tempUser || tempUser.dogrulamaKodu !== dogrulamaKodu) {
      return res.status(400).json({ message: 'Geçersiz doğrulama kodu' })
    }

    // Kodun geçerlilik süresini kontrol et
    if (new Date(tempUser.dogrulamaKoduGecerlilik) < new Date()) {
      return res.status(400).json({ message: 'Doğrulama kodunun süresi dolmuş' })
    }

    // Email kontrolü (tekrar)
    const existingUserByEmail = await User.findOne({ email })
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' })
    }

    // Telefon kontrolü (tekrar)
    const existingUserByPhone = await User.findOne({ telefon })
    if (existingUserByPhone) {
      return res.status(400).json({ message: 'Bu telefon numarası zaten kullanılıyor' })
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(sifre, salt)

    // Yeni kullanıcı oluştur
    const user = new User({
      ad,
      soyad,
      email,
      telefon,
      il,
      yurt,
      sifre: hashedPassword,
      telefonDogrulandi: true
    })

    await user.save()

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'pazarlio-super-secret-jwt-key-2024',
      { expiresIn: '1d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        ad: user.ad,
        soyad: user.soyad,
        email: user.email,
        telefon: user.telefon,
        il: user.il,
        yurt: user.yurt,
        telefonDogrulandi: user.telefonDogrulandi
      }
    })
  } catch (error) {
    console.error('Kayıt doğrulama hatası:', error)
    res.status(500).json({ message: 'Kayıt tamamlanamadı' })
  }
})

// Kayıt ol (eski yöntem - şifre ile direkt kayıt)
router.post('/kayit', async (req, res) => {
  try {
    const { ad, soyad, email, telefon, il, yurt, sifre } = req.body

    console.log('Kayıt isteği:', { 
      ad, 
      soyad, 
      email, 
      telefon,
      il,
      yurt,
      sifre: sifre ? '***' : 'boş' 
    })

    // Email kontrolü
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() })
    if (existingUserByEmail) {
      console.log('Email zaten kullanılıyor:', email)
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' })
    }

    // Telefon kontrolü
    const temizTelefon = telefon.replace(/\D/g, '')
    const existingUserByPhone = await User.findOne({ telefon: temizTelefon })
    if (existingUserByPhone) {
      console.log('Telefon zaten kullanılıyor:', temizTelefon)
      return res.status(400).json({ message: 'Bu telefon numarası zaten kullanılıyor' })
    }

    // Yeni kullanıcı oluştur (şifre model middleware'inde hashlenir)
    const user = new User({
      ad,
      soyad,
      email: email.toLowerCase(),
      telefon: temizTelefon,
      il,
      yurt,
      sifre: sifre // Model middleware'i otomatik hashleyecek
    })

    await user.save()

    console.log('Kullanıcı kaydedildi:', { 
      id: user._id, 
      email: user.email, 
      telefon: user.telefon
    })

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'pazarlio-super-secret-jwt-key-2024',
      { expiresIn: '1d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        ad: user.ad,
        soyad: user.soyad,
        email: user.email,
        telefon: user.telefon,
        il: user.il,
        yurt: user.yurt
      }
    })
  } catch (error) {
    console.error('Kayıt hatası:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

// Doğrulama kodu gönder
router.post('/dogrulama-kodu-gonder', async (req, res) => {
  try {
    const { telefon } = req.body

    console.log('Doğrulama kodu gönderme isteği:', { telefon })

    // Telefon numarasını temizle
    const temizTelefon = telefon.replace(/\D/g, '')
    console.log('Temizlenmiş telefon:', temizTelefon)
    
    // Kullanıcıyı bul
    const user = await User.findOne({ telefon: temizTelefon })
    if (!user) {
      console.log('Kullanıcı bulunamadı:', temizTelefon)
      return res.status(404).json({ message: 'Bu telefon numarası ile kayıtlı kullanıcı bulunamadı' })
    }

    console.log('Kullanıcı bulundu:', { 
      id: user._id, 
      ad: user.ad, 
      email: user.email, 
      telefon: user.telefon 
    })

    // 6 haneli doğrulama kodu oluştur
    const dogrulamaKodu = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('Oluşturulan doğrulama kodu:', dogrulamaKodu)
    
    // Kodu veritabanına kaydet (10 dakika geçerli)
    user.dogrulamaKodu = dogrulamaKodu
    user.dogrulamaKoduGecerlilik = new Date(Date.now() + 10 * 60 * 1000) // 10 dakika
    await user.save()

    console.log('Doğrulama kodu veritabanına kaydedildi')

    // SMS gönder (test modunda console'a yazdır)
    if (process.env.NODE_ENV === 'production' && twilioClient) {
      try {
        await twilioClient.messages.create({
          body: `PazarLio doğrulama kodunuz: ${dogrulamaKodu}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+90${temizTelefon}`
        })
        console.log('SMS başarıyla gönderildi:', temizTelefon)
      } catch (smsError) {
        console.error('SMS gönderme hatası:', smsError)
        // SMS hatası olsa bile kodu console'da göster
        console.log(`⚠️ SMS gönderilemedi ama kod hazır: ${dogrulamaKodu}`)
      }
    } else {
      // Test modunda console'a yazdır
      console.log('')
      console.log('🔐 ==========================================')
      console.log('📱 TELEFON DOĞRULAMA KODU')
      console.log('==========================================')
      console.log(`📞 Telefon: ${temizTelefon}`)
      console.log(`🔢 Kod: ${dogrulamaKodu}`)
      console.log(`⏰ Geçerlilik: 10 dakika`)
      console.log(`👤 Kullanıcı: ${user.ad} ${user.soyad}`)
      console.log('==========================================')
      console.log('')
    }

    res.json({ 
      message: 'Doğrulama kodu gönderildi',
      telefon: temizTelefon.replace(/(\d{3})(\d{3})(\d{4})/, '$1 *** $3'), // Telefon numarasını gizle
      testMode: process.env.NODE_ENV !== 'production',
      kodGoster: process.env.NODE_ENV !== 'production', // Test modunda frontend'e bilgi ver
      testCode: process.env.NODE_ENV !== 'production' ? dogrulamaKodu : null // Test modunda kodu gönder
    })
  } catch (error) {
    console.error('Doğrulama kodu gönderme hatası:', error)
    res.status(500).json({ message: 'Doğrulama kodu gönderilemedi' })
  }
})

// Doğrulama kodu ile giriş
router.post('/dogrulama-kodu-giris', async (req, res) => {
  try {
    const { telefon, dogrulamaKodu } = req.body

    // Telefon numarasını temizle
    const temizTelefon = telefon.replace(/\D/g, '')
    
    // Kullanıcıyı bul
    const user = await User.findOne({ telefon: temizTelefon })
    if (!user) {
      return res.status(404).json({ message: 'Bu telefon numarası ile kayıtlı kullanıcı bulunamadı' })
    }

    // Doğrulama kodunu kontrol et
    if (!user.dogrulamaKodu || user.dogrulamaKodu !== dogrulamaKodu) {
      return res.status(400).json({ message: 'Geçersiz doğrulama kodu' })
    }

    // Kodun geçerlilik süresini kontrol et
    if (user.dogrulamaKoduGecerlilik < new Date()) {
      return res.status(400).json({ message: 'Doğrulama kodunun süresi dolmuş' })
    }

    // Telefonu doğrulanmış olarak işaretle
    user.telefonDogrulandi = true
    user.dogrulamaKodu = null
    user.dogrulamaKoduGecerlilik = null
    await user.save()

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'pazarlio-super-secret-jwt-key-2024',
      { expiresIn: '1d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        ad: user.ad,
        soyad: user.soyad,
        email: user.email,
        telefon: user.telefon,
        telefonDogrulandi: user.telefonDogrulandi
      }
    })
  } catch (error) {
    console.error('Doğrulama kodu giriş hatası:', error)
    res.status(500).json({ message: 'Giriş yapılamadı' })
  }
})

// Giriş yap (şifre ile)
router.post('/giris', async (req, res) => {
  try {
    const { emailOrPhone, sifre } = req.body

    console.log('Giriş isteği:', { emailOrPhone, sifre: sifre ? '***' : 'boş' })

    // Sadece email ile giriş yapılabilir
    if (!emailOrPhone.includes('@')) {
      console.log('Telefon numarası ile giriş denendi, reddedildi:', emailOrPhone)
      return res.status(400).json({ message: 'Sadece email adresi ile giriş yapabilirsiniz' })
    }

    // Email ile kullanıcıyı bul
    const user = await User.findOne({ email: emailOrPhone.toLowerCase() })
    console.log('Email ile arama yapıldı:', emailOrPhone.toLowerCase())

    if (!user) {
      console.log('Kullanıcı bulunamadı')
      return res.status(400).json({ message: 'Geçersiz email veya şifre' })
    }

    console.log('Kullanıcı bulundu:', { 
      id: user._id, 
      email: user.email, 
      telefon: user.telefon || 'belirtilmedi',
      sifreHashli: user.sifre ? 'var' : 'yok'
    })

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(sifre, user.sifre)
    console.log('Şifre kontrolü:', isMatch)
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre' })
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'pazarlio-super-secret-jwt-key-2024',
      { expiresIn: '1d' }
    )

    console.log('Giriş başarılı:', user.email)

    res.json({
      token,
      user: {
        id: user._id,
        ad: user.ad,
        soyad: user.soyad,
        email: user.email,
        telefon: user.telefon,
        il: user.il,
        yurt: user.yurt,
        telefonDogrulandi: user.telefonDogrulandi
      }
    })
  } catch (error) {
    console.error('Giriş hatası:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

// Şifremi unuttum - doğrulama kodu gönder
router.post('/sifremi-unuttum', async (req, res) => {
  try {
    const { telefon } = req.body

    // Telefon numarasını temizle
    const temizTelefon = telefon.replace(/\D/g, '')
    
    // Kullanıcıyı bul
    const user = await User.findOne({ telefon: temizTelefon })
    if (!user) {
      return res.status(404).json({ message: 'Bu telefon numarası ile kayıtlı kullanıcı bulunamadı' })
    }

    // 6 haneli doğrulama kodu oluştur
    const dogrulamaKodu = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Kodu veritabanına kaydet (10 dakika geçerli)
    user.dogrulamaKodu = dogrulamaKodu
    user.dogrulamaKoduGecerlilik = new Date(Date.now() + 10 * 60 * 1000) // 10 dakika
    await user.save()

    // SMS gönder (test modunda console'a yazdır)
    if (process.env.NODE_ENV === 'production' && twilioClient) {
      try {
        await twilioClient.messages.create({
          body: `Şifre sıfırlama kodunuz: ${dogrulamaKodu}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+90${temizTelefon}`
        })
      } catch (smsError) {
        console.error('SMS gönderme hatası:', smsError)
      }
    } else {
      // Test modunda console'a yazdır
      console.log(`Test modu - Şifre sıfırlama kodu: ${dogrulamaKodu} (${temizTelefon} numarasına gönderildi)`)
    }

    res.json({ 
      message: 'Şifre sıfırlama kodu gönderildi',
      telefon: temizTelefon.replace(/(\d{3})(\d{3})(\d{4})/, '$1 *** $3') // Telefon numarasını gizle
    })
  } catch (error) {
    console.error('Şifre sıfırlama kodu gönderme hatası:', error)
    res.status(500).json({ message: 'Şifre sıfırlama kodu gönderilemedi' })
  }
})

// Şifre sıfırlama kodu doğrulama
router.post('/sifre-sifirlama-dogrula', async (req, res) => {
  try {
    const { telefon, dogrulamaKodu } = req.body

    // Telefon numarasını temizle
    const temizTelefon = telefon.replace(/\D/g, '')
    
    // Kullanıcıyı bul
    const user = await User.findOne({ telefon: temizTelefon })
    if (!user) {
      return res.status(404).json({ message: 'Bu telefon numarası ile kayıtlı kullanıcı bulunamadı' })
    }

    // Doğrulama kodunu kontrol et
    if (!user.dogrulamaKodu || user.dogrulamaKodu !== dogrulamaKodu) {
      return res.status(400).json({ message: 'Geçersiz doğrulama kodu' })
    }

    // Kodun geçerlilik süresini kontrol et
    if (user.dogrulamaKoduGecerlilik < new Date()) {
      return res.status(400).json({ message: 'Doğrulama kodunun süresi dolmuş' })
    }

    // Geçici token oluştur (şifre değiştirme için)
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password_reset' },
      process.env.JWT_SECRET || 'pazarlio-super-secret-jwt-key-2024',
      { expiresIn: '15m' } // 15 dakika geçerli
    )

    res.json({
      message: 'Doğrulama başarılı',
      resetToken,
      user: {
        id: user._id,
        ad: user.ad,
        soyad: user.soyad,
        email: user.email,
        telefon: user.telefon
      }
    })
  } catch (error) {
    console.error('Şifre sıfırlama doğrulama hatası:', error)
    res.status(500).json({ message: 'Doğrulama yapılamadı' })
  }
})

// Yeni şifre belirleme
router.post('/yeni-sifre-belirle', async (req, res) => {
  try {
    const { resetToken, yeniSifre } = req.body

    if (!resetToken || !yeniSifre) {
      return res.status(400).json({ message: 'Geçersiz istek' })
    }

    // Token'ı doğrula
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'gizli-anahtar')
    
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ message: 'Geçersiz token' })
    }

    // Kullanıcıyı bul
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
    }

    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(yeniSifre, salt)

    // Şifreyi güncelle
    user.sifre = hashedPassword
    user.dogrulamaKodu = null
    user.dogrulamaKoduGecerlilik = null
    await user.save()

    res.json({
      message: 'Şifreniz başarıyla güncellendi'
    })
  } catch (error) {
    console.error('Şifre güncelleme hatası:', error)
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token' })
    }
    res.status(500).json({ message: 'Şifre güncellenemedi' })
  }
})

// Debug: Tüm kullanıcıları listele (sadece geliştirme için)
router.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find({}, { sifre: 0 }) // Şifreleri hariç tut
    res.json({
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        ad: user.ad,
        soyad: user.soyad,
        email: user.email,
        telefon: user.telefon,
        telefonDogrulandi: user.telefonDogrulandi,
        createdAt: user.createdAt
      }))
    })
  } catch (error) {
    console.error('Debug kullanıcı listesi hatası:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

// Profil güncelleme
router.put('/profile', auth, async (req, res) => {
  try {
    const { ad, soyad, email, telefon } = req.body

    // E-posta değiştiyse ve başka bir kullanıcı tarafından kullanılıyorsa
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' })
      }
    }

    // Kullanıcı bilgilerini güncelle
    req.user.ad = ad
    req.user.soyad = soyad
    req.user.email = email
    req.user.telefon = telefon

    await req.user.save()

    res.json({
      user: {
        id: req.user._id,
        ad: req.user.ad,
        soyad: req.user.soyad,
        email: req.user.email,
        telefon: req.user.telefon
      }
    })
  } catch (error) {
    console.error('Profil güncelleme hatası:', error)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

module.exports = router 