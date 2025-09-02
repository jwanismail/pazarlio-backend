import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaEnvelope, FaLock, FaSignInAlt, FaPhone, FaMobile } from 'react-icons/fa'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    sifre: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState('password') // 'password' veya 'sms'

  // Giriş yapıldıktan sonra yönlendirilecek sayfa
  const from = location.state?.from || '/'

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
    
    if (name === 'emailOrPhone' && !value.includes('@')) {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Telefon numarasından boşlukları temizle
      const cleanEmailOrPhone = formData.emailOrPhone.replace(/\s/g, '')
      const result = await login(cleanEmailOrPhone, formData.sifre)
      if (result.success) {
        navigate(from)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Veya{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              yeni hesap oluşturun
            </Link>
          </p>
        </div>

        {/* Giriş yöntemi seçimi */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLoginMethod('password')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              loginMethod === 'password'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FaEnvelope className="text-sm" />
              <span>Şifre ile Giriş</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('sms')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              loginMethod === 'sms'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FaMobile className="text-sm" />
              <span>SMS ile Giriş</span>
            </div>
          </button>
        </div>

        {loginMethod === 'password' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="emailOrPhone" className="sr-only">E-posta veya Telefon</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type="text"
                    required
                    maxLength="50"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="E-posta adresi veya telefon numarası"
                  />
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Şifre"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaSignInAlt className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                </span>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/sifremi-unuttum" className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
                Şifremi unuttum
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMobile className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                SMS ile Giriş
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Telefon numaranıza gönderilen doğrulama kodu ile giriş yapın
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/telefon-dogrulama')}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaMobile className="mr-2" />
                Telefon Doğrulama Sayfasına Git
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login 