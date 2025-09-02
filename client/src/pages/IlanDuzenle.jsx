import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FaImage, 
  FaMapMarkerAlt, 
  FaTrash, 
  FaPhone, 
  FaTag, 
  FaArrowLeft, 
  FaSave, 
  FaTimes, 
  FaEdit, 
  FaEye, 
  FaCheck, 
  FaExclamationTriangle,
  FaUpload,
  FaSpinner,
  FaShieldAlt,
  FaCalendarAlt,
  FaUser,
  FaMoneyBillWave
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

// API URL'ini doğrudan tanımla
const API_URL = 'http://localhost:5001'

const IlanDuzenle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    fiyat: '',
    konum: '',
    iletisim: '',
    kategori: '',
    resimler: [],
    satildi: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Kategori seçenekleri
  const kategoriler = [
    'Yemek',
    'Kozmetik',
    'Giyim',
    'Teknoloji',
    'Elektronik Sigara & Puff',
    'Diğer'
  ]

  useEffect(() => {
    // Kullanıcı girişi kontrolü
    if (!user) {
      navigate('/login', { state: { from: `/ilan-duzenle/${id}` } })
      return
    }

    // İlanı API'den al
    const fetchIlan = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ilanlar/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'İlan yüklenirken bir hata oluştu')
        }

        // İlanın sahibi kontrolü
        if (data.ilan.kullaniciId !== (user.user?.id || user.id)) {
          navigate('/ilanlarim')
          return
        }

        setFormData({
          baslik: data.ilan.baslik,
          aciklama: data.ilan.aciklama,
          fiyat: data.ilan.fiyat,
          konum: data.ilan.konum,
          iletisim: data.ilan.iletisim,
          kategori: data.ilan.kategori,
          resimler: data.ilan.resimler || [],
          satildi: data.ilan.satildi || false
        })
      } catch (err) {
        console.error('İlan yükleme hatası:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchIlan()
  }, [id, navigate, user])

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length + formData.resimler.length > 5) {
      setError('Maksimum 5 resim yükleyebilirsiniz')
      return
    }

    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })
    
    try {
      const base64Images = await Promise.all(promises)
      setFormData(prev => ({
        ...prev,
        resimler: [...prev.resimler, ...base64Images]
      }))
      setError('')
    } catch (err) {
      setError('Resim yüklenirken bir hata oluştu')
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Form verilerini kontrol et
      if (!formData.baslik || !formData.aciklama || !formData.fiyat || !formData.konum || !formData.kategori || !formData.iletisim) {
        throw new Error('Lütfen tüm alanları doldurun')
      }

      if (formData.resimler.length === 0) {
        throw new Error('En az bir resim yüklemelisiniz')
      }

      // API'ye gönder
      const response = await fetch(`${API_URL}/api/ilanlar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...formData,
          kullaniciId: user.user?.id || user.id,
          kullaniciAdi: user.user?.ad || user.ad
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'İlan güncellenirken bir hata oluştu')
      }
      
      setSuccess('İlan başarıyla güncellendi!')
      setTimeout(() => {
        navigate('/ilanlarim')
      }, 2000)
    } catch (err) {
      console.error('İlan güncelleme hatası:', err)
      setError(err.message || 'İlan güncellenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">İlan yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/ilanlarim')}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FaArrowLeft className="text-sm" />
                <span>Geri Dön</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  İlan Düzenle
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  İlanınızı güncelleyin ve daha iyi sonuçlar alın
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  previewMode 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                <FaEye className="text-sm" />
                <span>{previewMode ? 'Düzenle' : 'Önizle'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Hata
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <FaCheck className="text-green-500 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Başarılı
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {success}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FaEdit className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  İlan Bilgileri
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Başlık */}
                <div>
                  <label htmlFor="baslik" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İlan Başlığı *
                  </label>
                  <input
                    type="text"
                    id="baslik"
                    name="baslik"
                    value={formData.baslik}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ürününüzü en iyi şekilde tanımlayan bir başlık yazın"
                    required
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori *
                  </label>
                  <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {kategoriler.map((kategori) => (
                      <option key={kategori} value={kategori}>
                        {kategori}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Açıklama */}
                <div>
                  <label htmlFor="aciklama" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    id="aciklama"
                    name="aciklama"
                    rows="4"
                    value={formData.aciklama}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Ürününüz hakkında detaylı bilgi verin..."
                    required
                  />
                </div>

                {/* Fiyat ve Konum */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fiyat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fiyat (₺) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="fiyat"
                        name="fiyat"
                        value={formData.fiyat}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="0"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaMoneyBillWave className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="konum" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konum *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="konum"
                        name="konum"
                        value={formData.konum}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Yurt, bina, oda numarası..."
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* İletişim */}
                <div>
                  <label htmlFor="iletisim" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İletişim Numarası *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="iletisim"
                      name="iletisim"
                      value={formData.iletisim}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+90 5XX XXX XX XX"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Resimler */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resimler * (Maksimum 5 adet)
                  </label>
                  
                  {/* Mevcut Resimler */}
                  {formData.resimler.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {formData.resimler.map((resim, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={resim}
                            alt={`Resim ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resim Yükleme */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Resim yüklemek için tıklayın veya sürükleyin
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG, GIF (Maksimum 5MB)
                      </p>
                    </label>
                  </div>
                </div>

                {/* Satıldı Checkbox */}
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <input
                    type="checkbox"
                    id="satildi"
                    name="satildi"
                    checked={formData.satildi}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="satildi" className="text-sm text-gray-700 dark:text-gray-300">
                    Bu ürün satıldı
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/ilanlarim')}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Güncelleniyor...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Güncelle</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FaEye className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Önizleme
                </h3>
              </div>

              {/* İlan Önizleme */}
              <div className="space-y-4">
                {/* Resim */}
                {formData.resimler.length > 0 && (
                  <div className="relative">
                    <img
                      src={formData.resimler[0]}
                      alt={formData.baslik}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    {formData.satildi && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Satıldı
                      </div>
                    )}
                  </div>
                )}

                {/* Başlık */}
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formData.baslik || 'İlan başlığı burada görünecek'}
                </h4>

                {/* Fiyat */}
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formData.fiyat ? `₺${formData.fiyat}` : '₺0'}
                </div>

                {/* Kategori */}
                {formData.kategori && (
                  <div className="flex items-center space-x-2">
                    <FaTag className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.kategori}
                    </span>
                  </div>
                )}

                {/* Konum */}
                {formData.konum && (
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.konum}
                    </span>
                  </div>
                )}

                {/* Açıklama */}
                {formData.aciklama && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {formData.aciklama}
                    </p>
                  </div>
                )}

                {/* İletişim */}
                {formData.iletisim && (
                  <div className="flex items-center space-x-2">
                    <FaPhone className="text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.iletisim}
                    </span>
                  </div>
                )}

                {/* Resim Sayısı */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
                  <FaImage />
                  <span>{formData.resimler.length} resim</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IlanDuzenle 