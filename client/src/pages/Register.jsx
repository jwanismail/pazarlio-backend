import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus, FaMobile, FaKey, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { turkiyeIlleri, yurtTipleri } from '../data/turkiyeIlleri'

const Register = () => {
  const navigate = useNavigate()
  const { register, login } = useAuth()
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    il: '',
    yurt: '',
    sifre: '',
    sifreTekrar: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registerStep, setRegisterStep] = useState('form') // 'form' veya 'verification'
  const [tempUser, setTempUser] = useState(null)
  const [dogrulamaKodu, setDogrulamaKodu] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(0)

  // Telefon numarası formatlaması
  const formatPhoneNumber = (value) => {
    // Sadece rakamları al
    const phoneNumber = value.replace(/\D/g, '')
    
    // Türkiye telefon numarası formatı (5XX XXX XX XX)
    if (phoneNumber.length <= 3) {
      return phoneNumber
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`
    } else if (phoneNumber.length <= 8) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`
    } else {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'telefon') {
      // Telefon numarası formatlaması
      const formattedValue = formatPhoneNumber(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Doğrulama kodu gönder
  const handleSendVerificationCode = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.sifre !== formData.sifreTekrar) {
      setError('Şifreler eşleşmiyor')
      return
    }

    setLoading(true)

    try {
      // Telefon numarasından boşlukları temizle
      const cleanTelefon = formData.telefon.replace(/\s/g, '')
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/kayit-dogrulama-kodu-gonder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ad: formData.ad,
          soyad: formData.soyad,
          email: formData.email,
          telefon: cleanTelefon,
          il: formData.il,
          yurt: formData.yurt,
          sifre: formData.sifre
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTempUser(data.tempUser)
        setRegisterStep('verification')
        setSuccess(data.message)
        setCountdown(60) // 60 saniye geri sayım
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Doğrulama kodu gönderilemedi')
    }

    setLoading(false)
  }

  // Doğrulama kodu ile kayıt tamamla
  const handleVerifyAndRegister = async () => {
    if (!dogrulamaKodu.trim()) {
      setError('Lütfen doğrulama kodunu girin')
      return
    }

    setLoading(true)
    setError('')

    try {
      const cleanTelefon = formData.telefon.replace(/\s/g, '')
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/kayit-dogrulama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ad: formData.ad,
          soyad: formData.soyad,
          email: formData.email,
          telefon: cleanTelefon,
          il: formData.il,
          yurt: formData.yurt,
          sifre: formData.sifre,
          dogrulamaKodu,
          tempUser
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Kayıt başarılı! Giriş yapılıyor...')
        // AuthContext kullanarak kullanıcıyı ayarla
        const userWithToken = {
          ...data.user,
          token: data.token
        }
        localStorage.setItem('user', JSON.stringify(userWithToken))
        setTimeout(() => {
          window.location.reload() // Context'in güncellenmesi için sayfayı yenile
        }, 1000)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Kayıt tamamlanamadı')
    }

    setLoading(false)
  }

  // Geri sayım için useEffect
  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.sifre !== formData.sifreTekrar) {
      setError('Şifreler eşleşmiyor')
      return
    }

    setLoading(true)

    try {
      // Telefon numarasından boşlukları temizle
      const cleanTelefon = formData.telefon.replace(/\s/g, '')
      const result = await register(
        formData.ad,
        formData.soyad,
        formData.email,
        cleanTelefon,
        formData.il,
        formData.yurt,
        formData.sifre
      )
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Kayıt olurken bir hata oluştu')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Yeni Hesap Oluşturun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Veya{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              mevcut hesabınıza giriş yapın
            </Link>
          </p>
        </div>

        {registerStep === 'form' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendVerificationCode}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2"
                role="alert"
              >
                <FaTimesCircle className="text-red-500 flex-shrink-0" />
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="ad" className="sr-only">Ad</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="ad"
                    name="ad"
                    type="text"
                    required
                    value={formData.ad}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Ad"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="soyad" className="sr-only">Soyad</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="soyad"
                    name="soyad"
                    type="text"
                    required
                    value={formData.soyad}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Soyad"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="sr-only">E-posta</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="E-posta adresi"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="telefon" className="sr-only">Telefon</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="telefon"
                    name="telefon"
                    type="tel"
                    required
                    maxLength="13"
                    value={formData.telefon}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="5XX XXX XX XX"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="il" className="sr-only">İl</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="il"
                    name="il"
                    required
                    value={formData.il}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">İl Seçiniz</option>
                    {turkiyeIlleri.map((il) => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="yurt" className="sr-only">Yurt</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="yurt"
                    name="yurt"
                    required
                    value={formData.yurt}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Yurt Tipi Seçiniz</option>
                    {yurtTipleri.map((yurt) => (
                      <option key={yurt} value={yurt}>{yurt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="sifre" className="sr-only">Şifre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="sifre"
                    name="sifre"
                    type="password"
                    required
                    value={formData.sifre}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Şifre"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="sifreTekrar" className="sr-only">Şifre Tekrar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="sifreTekrar"
                    name="sifreTekrar"
                    type="password"
                    required
                    value={formData.sifreTekrar}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Şifre tekrar"
                  />
                </div>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaMobile className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                </span>
                {loading ? 'Doğrulama Kodu Gönderiliyor...' : 'Telefon Doğrulama ile Kayıt Ol'}
              </motion.button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Veya{' '}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  şifre ile direkt kayıt ol
                </button>
              </p>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2"
                role="alert"
              >
                <FaTimesCircle className="text-red-500 flex-shrink-0" />
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center space-x-2"
                role="alert"
              >
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span className="block sm:inline">{success}</span>
              </motion.div>
            )}

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMobile className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Telefon Doğrulama
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {formData.telefon.replace(/(\d{3})(\d{3})(\d{4})/, '$1 *** $3')} numarasına gönderilen kodu girin
              </p>
            </div>

            <div>
              <label htmlFor="dogrulamaKodu" className="sr-only">Doğrulama Kodu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dogrulamaKodu"
                  type="text"
                  maxLength={6}
                  value={dogrulamaKodu}
                  onChange={(e) => setDogrulamaKodu(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-lg font-mono"
                  placeholder="6 haneli kodu girin"
                />
              </div>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyAndRegister}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Kayıt Tamamlanıyor...' : 'Kayıt Tamamla'}
              </motion.button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Yeni kod gönderebilmek için {countdown} saniye bekleyin
                  </p>
                ) : (
                  <button
                    onClick={handleSendVerificationCode}
                    disabled={loading}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
                  >
                    Yeni kod gönder
                  </button>
                )}
              </div>

              <button
                onClick={() => setRegisterStep('form')}
                className="w-full text-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors duration-200"
              >
                ← Geri dön
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Register 