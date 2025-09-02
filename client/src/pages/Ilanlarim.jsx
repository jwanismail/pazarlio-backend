import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaEye, 
  FaChartLine, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTag, 
  FaPhone, 
  FaExclamationTriangle,
  FaSpinner,
  FaArrowRight,
  FaFilter,
  FaSearch,
  FaSort,
  FaEllipsisV,
  FaCopy,
  FaShare,
  FaHeart,
  FaMoneyBillWave,
  FaUser,
  FaClock,
  FaShieldAlt,
  FaStar,
  FaTrophy,
  FaRocket,
  FaImage,
  FaTh,
  FaList,
  FaTimes,
  FaCheckCircle
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// API URL'ini doğrudan tanımla
const API_URL = 'http://localhost:5001'

const Ilanlarim = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [ilanlar, setIlanlar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all') // all, active, sold
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date') // date, price, title
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedIlan, setSelectedIlan] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [selectedIlanlar, setSelectedIlanlar] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
    if (!user) {
      navigate('/login', { state: { from: '/ilanlarim' } })
      return
    }
  }, [user, navigate])

  useEffect(() => {
    if (user) {
      const fetchIlanlar = async () => {
        try {
          setLoading(true)
          // User objesinin yapısını kontrol et
          const userId = user.user?.id || user.id
          if (!userId) {
            throw new Error('Kullanıcı ID bulunamadı')
          }
          
          const response = await fetch(`${API_URL}/api/ilanlar/kullanici/${userId}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
          const data = await response.json()
          if (data.success) {
            setIlanlar(data.ilanlar)
          } else {
            throw new Error(data.message || 'İlanlar yüklenirken bir hata oluştu')
          }
        } catch (error) {
          console.error('İlanlar yüklenirken hata:', error)
          setError(error.message)
        } finally {
          setLoading(false)
        }
      }

      fetchIlanlar()
    }
  }, [user])

  const handleDelete = async (ilanId) => {
    try {
      const response = await fetch(`${API_URL}/api/ilanlar/${ilanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('İlan silinirken bir hata oluştu');
      }

      // State'i güncelle
      setIlanlar(prev => prev.filter(ilan => ilan._id !== ilanId));
      setSuccess('İlan başarıyla silindi!')
      setShowDeleteModal(false)
      setSelectedIlan(null)

      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('İlan silinirken hata:', error);
      setError('İlan silinirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleEdit = (ilanId) => {
    navigate(`/ilan-duzenle/${ilanId}`)
  }

  const handleView = (ilanId) => {
    navigate(`/ilan-detay/${ilanId}`)
  }

  const confirmDelete = (ilan) => {
    setSelectedIlan(ilan)
    setShowDeleteModal(true)
  }

  const handleBulkDelete = async () => {
    try {
      for (const ilanId of selectedIlanlar) {
        await fetch(`${API_URL}/api/ilanlar/${ilanId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      }
      
      setIlanlar(prev => prev.filter(ilan => !selectedIlanlar.includes(ilan._id)));
      setSelectedIlanlar([])
      setShowBulkActions(false)
      setSuccess(`${selectedIlanlar.length} ilan başarıyla silindi!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Toplu silme işlemi sırasında hata oluştu')
    }
  }

  const toggleIlanSelection = (ilanId) => {
    setSelectedIlanlar(prev => 
      prev.includes(ilanId) 
        ? prev.filter(id => id !== ilanId)
        : [...prev, ilanId]
    )
  }

  const selectAllIlanlar = () => {
    if (selectedIlanlar.length === filteredAndSortedIlanlar.length) {
      setSelectedIlanlar([])
    } else {
      setSelectedIlanlar(filteredAndSortedIlanlar.map(ilan => ilan._id))
    }
  }

  // Filtreleme ve sıralama
  const filteredAndSortedIlanlar = ilanlar
    .filter(ilan => {
      const matchesFilter = filter === 'all' || 
        (filter === 'active' && !ilan.satildi) || 
        (filter === 'sold' && ilan.satildi)
      
      const matchesSearch = ilan.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ilan.aciklama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ilan.kategori.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.fiyat - a.fiyat
        case 'title':
          return a.baslik.localeCompare(b.baslik)
        case 'date':
        default:
          return new Date(b.tarih) - new Date(a.tarih)
      }
    })

  // İstatistikler
  const stats = {
    total: ilanlar.length,
    active: ilanlar.filter(ilan => !ilan.satildi).length,
    sold: ilanlar.filter(ilan => ilan.satildi).length,
    totalValue: ilanlar.reduce((sum, ilan) => sum + ilan.fiyat, 0)
  }

  // Kullanıcı giriş yapmamışsa hiçbir şey gösterme
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaSpinner className="text-white text-2xl sm:text-3xl" />
          </motion.div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
            İlanlarınız Yükleniyor
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Lütfen bekleyin...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                İlanlarım
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                İlanlarınızı yönetin ve performansınızı takip edin
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/ilan-ver"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                <FaPlus className="mr-2" />
                Yeni İlan Ekle
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Alert Messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                <button 
                  onClick={() => setError('')}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <FaTimes />
                </button>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div 
              className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Başarılı
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {success}
                  </p>
                </div>
                <button 
                  onClick={() => setSuccess('')}
                  className="ml-auto text-green-400 hover:text-green-600"
                >
                  <FaTimes />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FaChartLine className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Toplam İlan</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FaRocket className="text-green-600 dark:text-green-400 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Aktif İlan</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <FaTrophy className="text-yellow-600 dark:text-yellow-400 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Satılan</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{stats.sold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <FaMoneyBillWave className="text-purple-600 dark:text-purple-400 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Toplam Değer</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">₺{stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <motion.div 
            className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {selectedIlanlar.length} ilan seçildi
                </span>
                <button
                  onClick={selectAllIlanlar}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  {selectedIlanlar.length === filteredAndSortedIlanlar.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm"
                >
                  <FaTrash className="mr-2 inline" />
                  Seçilenleri Sil
                </button>
                <button
                  onClick={() => {
                    setSelectedIlanlar([])
                    setShowBulkActions(false)
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors text-sm"
                >
                  <FaTimes className="mr-2 inline" />
                  İptal
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div 
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="İlanlarınızda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Filter and Sort */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-slate-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="all">Tüm İlanlar</option>
                  <option value="active">Aktif İlanlar</option>
                  <option value="sold">Satılan İlanlar</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <FaSort className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="date">Tarihe Göre</option>
                  <option value="price">Fiyata Göre</option>
                  <option value="title">Başlığa Göre</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                                 <button
                   onClick={() => setViewMode('grid')}
                   className={`p-2 rounded-lg transition-colors ${
                     viewMode === 'grid' 
                       ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                       : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                   }`}
                 >
                   <FaTh className="text-sm" />
                 </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FaList className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* İlanlar Grid/List */}
        {filteredAndSortedIlanlar.length > 0 ? (
          <motion.div 
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              : "space-y-4 sm:space-y-6"
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredAndSortedIlanlar.map((ilan, index) => (
              <motion.div
                key={ilan._id}
                className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700 ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                {/* Checkbox for bulk selection */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedIlanlar.includes(ilan._id)}
                    onChange={() => toggleIlanSelection(ilan._id)}
                    className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>

                {/* Resim */}
                <div className={`relative ${viewMode === 'list' ? 'sm:w-48 sm:h-32' : 'h-48'}`}>
                  {ilan.resimler && ilan.resimler.length > 0 ? (
                    <img
                      src={ilan.resimler[0]}
                      alt={ilan.baslik}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                      <FaImage className="text-slate-400 dark:text-slate-500 text-3xl sm:text-4xl" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {ilan.satildi && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                      Satıldı
                    </div>
                  )}

                  {/* Action Menu */}
                  <div className="absolute top-3 left-12">
                    <div className="relative group">
                      <button className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-200">
                        <FaEllipsisV className="text-slate-600 dark:text-slate-400 text-sm" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-2">
                          <button
                            onClick={() => handleView(ilan._id)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                          >
                            <FaEye className="mr-3" />
                            Görüntüle
                          </button>
                          <button
                            onClick={() => handleEdit(ilan._id)}
                            className="w-full flex items-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          >
                            <FaEdit className="mr-3" />
                            Düzenle
                          </button>
                          <button
                            onClick={() => confirmDelete(ilan)}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          >
                            <FaTrash className="mr-3" />
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* İlan Bilgileri */}
                <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {ilan.baslik}
                    </h3>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                    {ilan.aciklama}
                  </p>

                  {/* Kategori ve Tarih */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FaTag className="text-slate-400 text-sm" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {ilan.kategori}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-slate-400 text-sm" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(ilan.tarih).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  {/* Fiyat ve Konum */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₺{ilan.fiyat.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-slate-400 text-sm" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {ilan.konum}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(ilan._id)}
                      className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 text-sm"
                    >
                      <FaEye className="mr-2 text-sm" />
                      Görüntüle
                    </button>
                    <button
                      onClick={() => handleEdit(ilan._id)}
                      className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm"
                    >
                      <FaEdit className="mr-2 text-sm" />
                      Düzenle
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-12 max-w-md mx-auto border border-slate-200 dark:border-slate-700">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRocket className="text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {searchTerm || filter !== 'all' ? 'İlan Bulunamadı' : 'Henüz İlanınız Yok'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm sm:text-base">
                {searchTerm || filter !== 'all' 
                  ? 'Arama kriterlerine uygun ilan bulunamadı.' 
                  : 'İlk ilanınızı ekleyerek başlayın ve satışa başlayın!'
                }
              </p>
              <Link
                to="/ilan-ver"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              >
                <FaPlus className="mr-2" />
                İlk İlanınızı Ekleyin
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedIlan && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FaExclamationTriangle className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  İlanı Sil
                </h3>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm sm:text-base">
                <strong>"{selectedIlan.baslik}"</strong> ilanını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedIlan(null)
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 text-sm sm:text-base"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleDelete(selectedIlan._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 text-sm sm:text-base"
                >
                  Sil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Ilanlarim 