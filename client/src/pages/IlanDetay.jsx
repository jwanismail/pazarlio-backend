import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaPhone, 
  FaEnvelope, 
  FaCheck, 
  FaUser, 
  FaWhatsapp, 
  FaHeart, 
  FaShare, 
  FaEye,
  FaTag,
  FaClock,
  FaShieldAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaImage
} from 'react-icons/fa'

// API URL'ini doğrudan tanımla
const API_URL = 'http://localhost:5001'

const IlanDetay = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ilan, setIlan] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)
  const [fullImageIndex, setFullImageIndex] = useState(0)

  useEffect(() => {
    const fetchIlanDetay = async () => {
      try {
        setLoading(true)
        console.log('İlan ID:', id)
        console.log('API URL:', `${API_URL}/api/ilanlar/${id}`)
        
        const response = await fetch(`${API_URL}/api/ilanlar/${id}`)
        console.log('Response status:', response.status)
        
        const data = await response.json()
        console.log('Response data:', data)
        
        if (data.success) {
          setIlan(data.ilan)
        } else {
          throw new Error(data.message || 'İlan detayı yüklenirken bir hata oluştu')
        }
      } catch (error) {
        console.error('İlan detayı yüklenirken hata:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchIlanDetay()
    }
  }, [id])

  const handleWhatsApp = () => {
    if (!ilan || !ilan.iletisim) return
    const phoneNumber = ilan.iletisim.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=Merhaba, ${ilan.baslik} ilanı hakkında bilgi almak istiyorum.`
    window.open(whatsappUrl, '_blank')
  }

  const handleCall = () => {
    if (!ilan || !ilan.iletisim) return
    const phoneNumber = ilan.iletisim.replace(/\D/g, '')
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleShare = () => {
    if (!ilan) return
    if (navigator.share) {
      navigator.share({
        title: ilan.baslik,
        text: ilan.aciklama,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link kopyalandı!')
    }
  }

  const nextImage = () => {
    if (ilan && ilan.resimler && ilan.resimler.length > 1) {
      setSelectedImage((prev) => (prev + 1) % ilan.resimler.length)
    }
  }

  const prevImage = () => {
    if (ilan && ilan.resimler && ilan.resimler.length > 1) {
      setSelectedImage((prev) => (prev - 1 + ilan.resimler.length) % ilan.resimler.length)
    }
  }

  const openFullImage = (index) => {
    setFullImageIndex(index)
    setShowFullImage(true)
  }

  const closeFullImage = () => {
    setShowFullImage(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">İlan yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !ilan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimes className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              İlan Bulunamadı
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || 'Aradığınız ilan mevcut değil veya kaldırılmış olabilir.'}
            </p>
            <Link
              to="/kesfet"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" />
              İlanlara Geri Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Full Image Modal */}
      {showFullImage && ilan.resimler && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeFullImage}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <FaTimes className="text-2xl" />
            </button>
            <img
              src={ilan.resimler[fullImageIndex]}
              alt={ilan.baslik}
              className="max-w-full max-h-full object-contain"
            />
            {ilan.resimler.length > 1 && (
              <>
                <button
                  onClick={() => setFullImageIndex((prev) => (prev - 1 + ilan.resimler.length) % ilan.resimler.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <FaChevronLeft className="text-3xl" />
                </button>
                <button
                  onClick={() => setFullImageIndex((prev) => (prev + 1) % ilan.resimler.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <FaChevronRight className="text-3xl" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FaArrowLeft className="mr-2" />
            Geri Dön
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-red-500'
              }`}
            >
              <FaHeart className="text-lg" />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaShare className="text-lg" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Taraf - Resim Galerisi */}
          <div className="space-y-6">
            {/* Ana Resim */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {ilan.resimler && ilan.resimler.length > 0 ? (
                <>
                  <div className="relative">
                    <img
                      src={ilan.resimler[selectedImage]}
                      alt={ilan.baslik}
                      className="w-full h-96 lg:h-[500px] object-cover cursor-pointer"
                      onClick={() => openFullImage(selectedImage)}
                    />
                    
                    {/* Satıldı Badge */}
                    {ilan.satildi && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                        <FaCheck className="inline mr-2" />
                        Satıldı
                      </div>
                    )}

                    {/* Resim Navigasyon */}
                    {ilan.resimler.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <FaChevronRight className="text-gray-700 dark:text-gray-300" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Küçük Resimler */}
                  {ilan.resimler.length > 1 && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="flex space-x-3 overflow-x-auto">
                        {ilan.resimler.map((resim, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                              selectedImage === index
                                ? 'border-blue-500 shadow-lg'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                            }`}
                          >
                            <img
                              src={resim}
                              alt={`${ilan.baslik} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <FaImage className="text-6xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Resim Yok</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Taraf - İlan Detayları */}
          <div className="space-y-6">
            {/* İlan Başlığı ve Fiyat */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {ilan.baslik}
                </h1>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ₺{ilan.fiyat ? ilan.fiyat.toLocaleString() : '0'}
                  </div>
                  {ilan.kategori && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <FaTag className="inline mr-1" />
                      {ilan.kategori}
                    </div>
                  )}
                </div>
              </div>

              {/* İlan Meta Bilgileri */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  <span className="text-sm">{ilan.konum || 'Konum belirtilmemiş'}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <span className="text-sm">{ilan.tarih ? new Date(ilan.tarih).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş'}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaUser className="mr-2 text-blue-500" />
                  <span className="text-sm">{ilan.kullaniciAdi || 'Kullanıcı'}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaEye className="mr-2 text-blue-500" />
                  <span className="text-sm">Görüntülenme</span>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Açıklama
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {ilan.aciklama || 'Açıklama belirtilmemiş'}
                </p>
              </div>
            </div>

            {/* İletişim */}
            {!ilan.satildi && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  İletişim
                </h2>
                <div className="space-y-4">
                  {ilan.iletisim && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center">
                        <FaPhone className="mr-3 text-blue-500 text-xl" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{ilan.iletisim}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Telefon Numarası</p>
                        </div>
                      </div>
                      <button
                        onClick={handleCall}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                      >
                        Ara
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaWhatsapp className="mr-3 text-2xl" />
                    WhatsApp ile İletişime Geç
                  </button>
                </div>
              </div>
            )}

            {/* Güvenlik Bilgileri */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-blue-500 text-xl mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Güvenli Alışveriş
                </h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>• Yüz yüze görüşerek alışveriş yapın</p>
                <p>• Ürünü kontrol etmeden ödeme yapmayın</p>
                <p>• Şüpheli durumları bize bildirin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IlanDetay 