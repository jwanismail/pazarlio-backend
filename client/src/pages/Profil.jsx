import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaCamera, 
  FaSave, 
  FaTimes, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaBell,
  FaShieldAlt,
  FaCog,
  FaPalette,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowLeft,
  FaKey,
  FaSignOutAlt,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa'

const Profil = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Profil bilgileri
  const [profileData, setProfileData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    dogumTarihi: '',
    konum: '',
    bio: '',
    website: '',
    sosyalMedya: {
      instagram: '',
      twitter: '',
      facebook: '',
      linkedin: ''
    }
  })

  // Şifre değiştirme
  const [passwordData, setPasswordData] = useState({
    mevcutSifre: '',
    yeniSifre: '',
    yeniSifreTekrar: ''
  })

  // Bildirim ayarları
  const [notificationSettings, setNotificationSettings] = useState({
    emailBildirimleri: true,
    smsBildirimleri: false,
    pushBildirimleri: true,
    yeniIlanBildirimleri: true,
    mesajBildirimleri: true,
    fiyatDegisikligiBildirimleri: false,
    haftalikOzet: true
  })

  // Gizlilik ayarları
  const [privacySettings, setPrivacySettings] = useState({
    profilGorunurlugu: 'public',
    telefonGorunurlugu: true,
    emailGorunurlugu: false,
    konumGorunurlugu: true,
    aramaMotorlarindaGorunme: true
  })

  // Tema ayarları
  const [themeSettings, setThemeSettings] = useState({
    tema: 'auto',
    renkTemasi: 'blue',
    animasyonlar: true,
    kompaktMod: false
  })

  // Profil fotoğrafı
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Kullanıcı bilgilerini yükle
    const userData = user.user || user
    setProfileData({
      ad: userData.ad || '',
      soyad: userData.soyad || '',
      email: userData.email || '',
      telefon: userData.telefon || '',
      dogumTarihi: userData.dogumTarihi || '',
      konum: userData.konum || '',
      bio: userData.bio || '',
      website: userData.website || '',
      sosyalMedya: {
        instagram: userData.sosyalMedya?.instagram || '',
        twitter: userData.sosyalMedya?.twitter || '',
        facebook: userData.sosyalMedya?.facebook || '',
        linkedin: userData.sosyalMedya?.linkedin || ''
      }
    })
  }, [user, navigate])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('ad', profileData.ad)
      formData.append('soyad', profileData.soyad)
      formData.append('email', profileData.email)
      formData.append('telefon', profileData.telefon)
      formData.append('dogumTarihi', profileData.dogumTarihi)
      formData.append('konum', profileData.konum)
      formData.append('bio', profileData.bio)
      formData.append('website', profileData.website)
      formData.append('sosyalMedya', JSON.stringify(profileData.sosyalMedya))
      
      if (profileImage) {
        formData.append('profilFotografi', profileImage)
      }

      const response = await fetch('http://localhost:5001/profil-guncelle', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Profil bilgileriniz başarıyla güncellendi!')
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        setError(data.message || 'Profil güncellenirken bir hata oluştu')
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.yeniSifre !== passwordData.yeniSifreTekrar) {
      setError('Yeni şifreler eşleşmiyor')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5001/sifre-degistir', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          mevcutSifre: passwordData.mevcutSifre,
          yeniSifre: passwordData.yeniSifre
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Şifreniz başarıyla değiştirildi!')
        setPasswordData({
          mevcutSifre: '',
          yeniSifre: '',
          yeniSifreTekrar: ''
        })
      } else {
        setError(data.message || 'Şifre değiştirilirken bir hata oluştu')
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'profile', name: 'Profil Bilgileri', icon: FaUser },
    { id: 'security', name: 'Güvenlik', icon: FaShieldAlt },
    { id: 'notifications', name: 'Bildirimler', icon: FaBell },
    { id: 'privacy', name: 'Gizlilik', icon: FaUser },
    { id: 'theme', name: 'Tema', icon: FaPalette },
    { id: 'account', name: 'Hesap', icon: FaCog }
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Geri Dön
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profil Ayarları
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hesap bilgilerinizi ve tercihlerinizi yönetin
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-md flex items-center">
            <FaCheck className="mr-2" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-md flex items-center">
            <FaExclamationTriangle className="mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUser className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                      <FaCamera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Profil Fotoğrafı
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      JPG, PNG veya GIF. Maksimum 5MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      value={profileData.ad}
                      onChange={(e) => setProfileData({...profileData, ad: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      value={profileData.soyad}
                      onChange={(e) => setProfileData({...profileData, soyad: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={profileData.telefon}
                      onChange={(e) => setProfileData({...profileData, telefon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Doğum Tarihi
                    </label>
                    <input
                      type="date"
                      value={profileData.dogumTarihi}
                      onChange={(e) => setProfileData({...profileData, dogumTarihi: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konum
                    </label>
                    <input
                      type="text"
                      value={profileData.konum}
                      onChange={(e) => setProfileData({...profileData, konum: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hakkımda
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Kendiniz hakkında kısa bir açıklama..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center disabled:opacity-50"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Şifre Değiştir
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        value={passwordData.mevcutSifre}
                        onChange={(e) => setPasswordData({...passwordData, mevcutSifre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        value={passwordData.yeniSifre}
                        onChange={(e) => setPasswordData({...passwordData, yeniSifre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yeni Şifre (Tekrar)
                      </label>
                      <input
                        type="password"
                        value={passwordData.yeniSifreTekrar}
                        onChange={(e) => setPasswordData({...passwordData, yeniSifreTekrar: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center disabled:opacity-50"
                    >
                      {loading ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaKey className="mr-2" />
                      )}
                      Şifreyi Değiştir
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Bildirim Ayarları
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key === 'emailBildirimleri' && 'E-posta Bildirimleri'}
                          {key === 'smsBildirimleri' && 'SMS Bildirimleri'}
                          {key === 'pushBildirimleri' && 'Push Bildirimleri'}
                          {key === 'yeniIlanBildirimleri' && 'Yeni İlan Bildirimleri'}
                          {key === 'mesajBildirimleri' && 'Mesaj Bildirimleri'}
                          {key === 'fiyatDegisikligiBildirimleri' && 'Fiyat Değişikliği Bildirimleri'}
                          {key === 'haftalikOzet' && 'Haftalık Özet'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({
                          ...notificationSettings,
                          [key]: !value
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Gizlilik Ayarları
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profil Görünürlüğü
                    </label>
                    <select
                      value={privacySettings.profilGorunurlugu}
                      onChange={(e) => setPrivacySettings({
                        ...privacySettings,
                        profilGorunurlugu: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="public">Herkese Açık</option>
                      <option value="friends">Sadece Arkadaşlar</option>
                      <option value="private">Gizli</option>
                    </select>
                  </div>

                  {Object.entries(privacySettings).filter(([key]) => key !== 'profilGorunurlugu').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key === 'telefonGorunurlugu' && 'Telefon Numarası Görünürlüğü'}
                          {key === 'emailGorunurlugu' && 'E-posta Görünürlüğü'}
                          {key === 'konumGorunurlugu' && 'Konum Görünürlüğü'}
                          {key === 'aramaMotorlarindaGorunme' && 'Arama Motorlarında Görünme'}
                        </p>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({
                          ...privacySettings,
                          [key]: !value
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Tema Ayarları
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tema
                    </label>
                    <select
                      value={themeSettings.tema}
                      onChange={(e) => setThemeSettings({
                        ...themeSettings,
                        tema: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="light">Açık</option>
                      <option value="dark">Koyu</option>
                      <option value="auto">Otomatik</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Renk Teması
                    </label>
                    <select
                      value={themeSettings.renkTemasi}
                      onChange={(e) => setThemeSettings({
                        ...themeSettings,
                        renkTemasi: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="blue">Mavi</option>
                      <option value="green">Yeşil</option>
                      <option value="purple">Mor</option>
                      <option value="red">Kırmızı</option>
                      <option value="orange">Turuncu</option>
                    </select>
                  </div>

                  {Object.entries(themeSettings).filter(([key]) => !['tema', 'renkTemasi'].includes(key)).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {key === 'animasyonlar' && 'Animasyonlar'}
                          {key === 'kompaktMod' && 'Kompakt Mod'}
                        </p>
                      </div>
                      <button
                        onClick={() => setThemeSettings({
                          ...themeSettings,
                          [key]: !value
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Hesap Ayarları
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md">
                    <div>
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Hesabı Sil
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                      </p>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Hesabı Sil
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Çıkış Yap
                      </h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">
                        Tüm oturumlarınızdan çıkış yapın.
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profil 