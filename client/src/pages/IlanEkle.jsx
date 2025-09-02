import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaImage, FaMapMarkerAlt, FaTrash, FaPhone, FaTag, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { turkiyeIlleri } from '../data/turkiyeIlleri'

// API URL'ini doğrudan tanımla
const API_URL = 'http://localhost:5001'

const IlanEkle = () => {
  const navigate = useNavigate()
  const { user, validateAndCleanToken } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    fiyat: '',
    konum: '',
    il: user?.il || '',
    iletisim: '',
    resimler: [],
    satildi: false,
    kategori: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Kategori seçenekleri
  const kategoriler = [
    'Yemek',
    'Kozmetik',
    'Giyim',
    'Teknoloji',
    'Elektronik Sigara & Puff'
  ]

  // Adım başlıkları
  const stepTitles = [
    'İlan Başlığı',
    'Kategori Seçimi',
    'Açıklama',
    'Fiyat',
    'Konum',
    'İletişim',
    'Resimler',
    'Önizleme'
  ]

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
    if (!user) {
      navigate('/login', { state: { from: '/ilan-ver' } })
      return
    }
    
    // Token doğrulaması yap
    if (!validateAndCleanToken()) {
      navigate('/login', { state: { from: '/ilan-ver' } })
      return
    }
  }, [user, navigate, validateAndCleanToken])

  // Kullanıcı giriş yapmamışsa hiçbir şey gösterme
  if (!user) {
    return null
  }

  // Dosya seçildiğinde base64'e çevir
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })
    const base64Images = await Promise.all(promises)
    setFormData(prev => ({
      ...prev,
      resimler: [...prev.resimler, ...base64Images]
    }))
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      resimler: prev.resimler.filter((_, i) => i !== index)
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'iletisim') {
      // Eğer değer boşsa, boş bırak
      if (!value) {
        setFormData(prev => ({
          ...prev,
          [name]: ''
        }))
        return
      }

      // +90 prefix'ini kaldır ve sadece rakamları al
      const numbers = value.replace('+90 ', '').replace(/\D/g, '')
      
      // İlk rakam 0 ise, onu kaldır
      const cleanNumbers = numbers.startsWith('0') ? numbers.slice(1) : numbers
      
      // Maksimum 10 rakam olacak şekilde sınırla
      const limitedNumbers = cleanNumbers.slice(0, 10)
      
      // Format: +90 5XX XXX XX XX
      let formattedNumber = ''
      if (limitedNumbers.length > 0) {
        formattedNumber = '+90 ' + limitedNumbers.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedNumber
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const nextStep = () => {
    if (currentStep < stepTitles.length) {
      setCurrentStep(currentStep + 1)
      setError('')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Token doğrulaması
      if (!user.token) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.')
      }

      // Form verilerini kontrol et
      if (!formData.baslik || !formData.aciklama || !formData.fiyat || !formData.konum || !formData.il || !formData.kategori) {
        throw new Error('Lütfen tüm alanları doldurun')
      }
      if (formData.resimler.length === 0) {
        throw new Error('En az bir resim yüklemelisiniz')
      }

      console.log('Gönderilecek veri:', {
        ...formData,
        kullaniciAdi: `${user.ad} ${user.soyad}`,
        kullaniciId: user.id,
        tarih: new Date().toISOString()
      });

      // API'ye gönder
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

      try {
        console.log('İstek gönderiliyor...');
        const response = await fetch(`${API_URL}/api/ilanlar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            ...formData,
            kullaniciAdi: `${user.ad} ${user.soyad}`,
            kullaniciId: user.id,
            tarih: new Date().toISOString()
          })
        });

        clearTimeout(timeoutId);
        console.log('Sunucu yanıtı alındı:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Sunucu hatası:', errorData);
          
          // 401 hatası (Unauthorized) durumunda logout yap
          if (response.status === 401) {
            throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          }
          
          throw new Error(errorData.message || 'İlan eklenirken bir hata oluştu');
        }

        const data = await response.json();
        console.log('Sunucu yanıtı:', data);
        
        // Başarılı mesajı göster ve keşfet sayfasına yönlendir
        alert('İlan başarıyla eklendi!')
        navigate('/kesfet')
      } catch (err) {
        if (err.name === 'AbortError') {
          console.error('İstek zaman aşımına uğradı');
          throw new Error('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.');
        }
        console.error('İstek hatası:', err);
        throw err;
      }
    } catch (err) {
      console.error('İlan ekleme hatası:', err)
      setError(err.message || 'İlan eklenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  // Adım içeriğini render et
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // İlan Başlığı
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="baslik" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                İlanınız için bir başlık yazın
              </label>
              <input
                type="text"
                id="baslik"
                name="baslik"
                value={formData.baslik}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg p-4"
                placeholder="Örn: iPhone 13 Pro Max - Mükemmel Durumda"
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                İlanınızı en iyi şekilde tanımlayan kısa ve açıklayıcı bir başlık yazın.
              </p>
            </div>
          </div>
        )

      case 2: // Kategori
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                İlanınızın kategorisini seçin
              </label>
              <div className="grid grid-cols-1 gap-3">
                {kategoriler.map((kategori) => (
                  <label
                    key={kategori}
                    className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                      formData.kategori === kategori
                        ? 'border-blue-500 ring-2 ring-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="kategori"
                      value={kategori}
                      checked={formData.kategori === kategori}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                          {kategori}
                        </span>
                      </span>
                    </span>
                    {formData.kategori === kategori && (
                      <FaCheck className="h-5 w-5 text-blue-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 3: // Açıklama
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="aciklama" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                İlanınızı detaylı olarak açıklayın
              </label>
              <textarea
                id="aciklama"
                name="aciklama"
                rows="6"
                value={formData.aciklama}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg p-4"
                placeholder="Ürününüzün özelliklerini, durumunu ve neden satıldığını detaylı olarak açıklayın..."
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Detaylı açıklama alıcıların ürününüzü daha iyi anlamasını sağlar.
              </p>
            </div>
          </div>
        )

      case 4: // Fiyat
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="fiyat" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fiyat belirleyin
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="fiyat"
                  name="fiyat"
                  value={formData.fiyat}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 pl-12 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg p-4"
                  placeholder="0"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg font-medium">₺</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Makul bir fiyat belirleyin. Çok yüksek fiyatlar ilgi çekmeyebilir.
              </p>
            </div>
          </div>
        )

      case 5: // Konum
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="il" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                İl
              </label>
              <select
                id="il"
                name="il"
                value={formData.il}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg p-4"
                required
              >
                <option value="">İl Seçiniz</option>
                {turkiyeIlleri.map((il) => (
                  <option key={il} value={il}>{il}</option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                İlanınızın görüneceği il seçiniz.
              </p>
            </div>
            
            <div>
              <label htmlFor="konum" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detaylı Konum
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="konum"
                  name="konum"
                  value={formData.konum}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 pl-12 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg p-4"
                  placeholder="Örn: Kadıköy, Beşiktaş"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Alıcıların size ulaşabilmesi için detaylı konum bilginizi girin.
              </p>
            </div>
          </div>
        )

      case 6: // İletişim
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="iletisim" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                İletişim numaranız
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="iletisim"
                  name="iletisim"
                  value={formData.iletisim}
                  onChange={handleChange}
                  placeholder="+90 5XX XXX XX XX"
                  className="block w-full rounded-lg border-gray-300 pl-12 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg p-4"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Alıcıların size ulaşabilmesi için telefon numaranızı girin.
              </p>
            </div>
          </div>
        )

      case 7: // Resimler
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                Ürün fotoğrafları
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FaImage className="h-12 w-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Fotoğraf yüklemek için tıklayın
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, GIF dosyaları kabul edilir
                  </span>
                </label>
              </div>
              
              {formData.resimler.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Yüklenen Fotoğraflar ({formData.resimler.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.resimler.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Yüklenen resim ${idx + 1}`} className="h-32 w-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 opacity-80 group-hover:opacity-100"
                          title="Resmi Kaldır"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                En az bir fotoğraf yüklemelisiniz. Kaliteli fotoğraflar ilanınızın daha çok ilgi görmesini sağlar.
              </p>
            </div>
          </div>
        )

      case 8: // Önizleme
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                İlanınızın Önizlemesi
              </h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  {formData.resimler && formData.resimler.length > 0 ? (
                    <img
                      src={formData.resimler[0]}
                      alt={formData.baslik}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">Fotoğraf Yok</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {formData.baslik || 'Başlık girilmemiş'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {formData.aciklama || 'Açıklama girilmemiş'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₺{formData.fiyat || '0'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.kategori || 'Kategori seçilmemiş'}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    📍 {formData.il ? `${formData.konum}, ${formData.il}` : 'Konum girilmemiş'}
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                İlanınızı gözden geçirin. Her şey doğruysa "İlanı Yayınla" butonuna tıklayın.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stepTitles[currentStep - 1]}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentStep} / {stepTitles.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / stepTitles.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                <FaArrowLeft className="mr-2" />
                Geri
              </button>

              {currentStep < stepTitles.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  İleri
                  <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Yayınlanıyor...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      İlanı Yayınla
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default IlanEkle 