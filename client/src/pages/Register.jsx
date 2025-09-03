import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { turkiyeIlleri, yurtTipleri } from '../data/turkiyeIlleri'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    il: '',
    yurt: '',
    sifre: '',
    sifreTekrar: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.sifre !== formData.sifreTekrar) {
      setError('Şifreler eşleşmiyor')
      return
    }

    setLoading(true)

    try {
      const result = await register(
        formData.ad,
        formData.soyad,
        formData.email,
        '', // Telefon numarası artık gerekli değil
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2"
              role="alert"
            >
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
                <FaUserPlus className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
              </span>
              {loading ? 'Kayıt Oluşturuluyor...' : 'Hesap Oluştur'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register 