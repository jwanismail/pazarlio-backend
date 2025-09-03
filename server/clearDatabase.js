const mongoose = require('mongoose')
const User = require('./models/User')
const Ilan = require('./models/Ilan')

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb+srv://civanelismail571:Hirciv19@pazarlio2.kegaoz4.mongodb.net/ilan-db?retryWrites=true&w=majority&appName=pazarLio2'

async function clearDatabase() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB bağlantısı başarılı')

    // Admin kullanıcısını bul (silinmeyecek)
    const adminUser = await User.findOne({ email: 'civanelismail34@gmail.com' })
    
    if (!adminUser) {
      console.log('Admin kullanıcısı bulunamadı, oluşturuluyor...')
      // Admin kullanıcısı yoksa oluştur
      const newAdmin = new User({
        ad: 'Civan',
        soyad: 'Elismail',
        email: 'civanelismail34@gmail.com',
        telefon: '0000000000',
        il: 'İstanbul',
        yurt: 'Özel Yurt',
        sifre: 'admin123' // Model middleware'de hashlenir
      })
      await newAdmin.save()
      console.log('Admin kullanıcısı oluşturuldu')
    } else {
      console.log('Admin kullanıcısı mevcut:', adminUser.email)
    }

    // Tüm ilanları sil
    const deletedIlanlar = await Ilan.deleteMany({})
    console.log(`${deletedIlanlar.deletedCount} ilan silindi`)

    // Admin hariç tüm kullanıcıları sil
    const deletedUsers = await User.deleteMany({ 
      email: { $ne: 'civanelismail34@gmail.com' } 
    })
    console.log(`${deletedUsers.deletedCount} kullanıcı silindi`)

    // Son durumu kontrol et
    const totalUsers = await User.countDocuments()
    const totalIlanlar = await Ilan.countDocuments()
    
    console.log('\n=== VERİTABANI TEMİZLENDİ ===')
    console.log(`Toplam kullanıcı: ${totalUsers}`)
    console.log(`Toplam ilan: ${totalIlanlar}`)
    console.log('===============================\n')

    console.log('Veritabanı temizleme işlemi tamamlandı!')
    
  } catch (error) {
    console.error('Hata:', error)
  } finally {
    // Bağlantıyı kapat
    await mongoose.disconnect()
    console.log('MongoDB bağlantısı kapatıldı')
    process.exit(0)
  }
}

// Scripti çalıştır
clearDatabase()
