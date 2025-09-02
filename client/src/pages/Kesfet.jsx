import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { turkiyeIlleri } from '../data/turkiyeIlleri'
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTag, 
  FaCheck, 
  FaUser, 
  FaChevronLeft, 
  FaChevronRight,
  FaHeart,
  FaShare,
  FaEye,
  FaSpinner,
  FaSort,
  FaTh,
  FaList,
  FaStar,
  FaFire,
  FaClock,
  FaPhone,
  FaWhatsapp,
  FaImage,
  FaExclamationTriangle,
  FaRocket,
  FaTrophy,
  FaGem,
  FaShoppingCart,
  FaBookmark,
  FaEllipsisV,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'

// API URL'ini doğrudan tanımla
const API_URL = 'http://localhost:5001'

const Kesfet = () => {
  const navigate = useNavigate()
  const [ilanlar, setIlanlar] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('') // Kullanıcının yazdığı değer
  const [searchTerm, setSearchTerm] = useState('') // API'ye gönderilen değer
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedIl, setSelectedIl] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showSold, setShowSold] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalIlanlar, setTotalIlanlar] = useState(0)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [sortBy, setSortBy] = useState('date') // date, price, title
  const [sortOrder, setSortOrder] = useState('desc') // asc, desc
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [likedItems, setLikedItems] = useState(new Set())
  const itemsPerPage = 20

  const kategoriler = [
    { name: 'Yemek', icon: '🍕', color: 'bg-orange-100 text-orange-600' },
    { name: 'Kozmetik', icon: '💄', color: 'bg-pink-100 text-pink-600' },
    { name: 'Giyim', icon: '👕', color: 'bg-blue-100 text-blue-600' },
    { name: 'Teknoloji', icon: '💻', color: 'bg-purple-100 text-purple-600' },
    { name: 'Elektronik Sigara & Puff', icon: '💨', color: 'bg-gray-100 text-gray-600' }
  ]

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput)
      setCurrentPage(1) // Arama yapıldığında ilk sayfaya dön
    }, 500) // 500ms bekle

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    fetchIlanlar()
  }, [currentPage, searchTerm, selectedCategory, selectedIl, showSold, sortBy, sortOrder])

  const fetchIlanlar = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/ilanlar?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&category=${selectedCategory}&il=${selectedIl}&showSold=${showSold}`)
      const data = await response.json()
      if (data.success) {
        setIlanlar(data.ilanlar)
        setTotalPages(data.totalPages)
        setTotalIlanlar(data.totalIlanlar)
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

  const handleIlanClick = (ilan) => {
    navigate(`/ilan-detay/${ilan._id}`)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleLike = (e, ilanId) => {
    e.stopPropagation()
    setLikedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ilanId)) {
        newSet.delete(ilanId)
      } else {
        newSet.add(ilanId)
      }
      return newSet
    })
  }

  const handleShare = (e, ilan) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: ilan.baslik,
        text: ilan.aciklama,
        url: window.location.origin + `/ilan-detay/${ilan._id}`
      })
    } else {
      navigator.clipboard.writeText(window.location.origin + `/ilan-detay/${ilan._id}`)
      alert('Link kopyalandı!')
    }
  }

  const handleContact = (e, ilan) => {
    e.stopPropagation()
    if (ilan.iletisim) {
      window.open(`tel:${ilan.iletisim}`)
    }
  }

  const handleWhatsApp = (e, ilan) => {
    e.stopPropagation()
    if (ilan.iletisim) {
      const phone = ilan.iletisim.replace(/\D/g, '')
      const message = `Merhaba! "${ilan.baslik}" ilanınız hakkında bilgi almak istiyorum.`
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`)
    }
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedIl('')
    setShowSold(true)
    setPriceRange({ min: '', max: '' })
    setSortBy('date')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <FaArrowUp className="text-xs" />
    return <FaArrowDown className="text-xs" />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Minimal Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            Keşfet
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Yurt arkadaşlarınızın satışa çıkardığı ürünleri keşfedin
          </p>
        </div>

        {/* Clean Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ne arıyorsunuz?"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
            />
          </div>
        </div>

        {/* Minimal Filter Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                showFilters 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <FaFilter className="inline mr-2" />
              Filtreler
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalIlanlar} ilan
          </div>
        </div>

        {/* Clean Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İl
                </label>
                <select
                  value={selectedIl}
                  onChange={(e) => setSelectedIl(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tüm İller</option>
                  {turkiyeIlleri.map((il) => (
                    <option key={il} value={il}>{il}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tüm Kategoriler</option>
                  {kategoriler.map((kategori) => (
                    <option key={kategori.name} value={kategori.name}>
                      {kategori.icon} {kategori.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sıralama
                </label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Tarih</option>
                    <option value="price">Fiyat</option>
                    <option value="title">Başlık</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    {getSortIcon()}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showSold}
                    onChange={(e) => setShowSold(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Satılanları göster
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Filtreleri temizle
              </button>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {kategoriler.map((kategori) => (
              <button
                key={kategori.name}
                onClick={() => setSelectedCategory(selectedCategory === kategori.name ? '' : kategori.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === kategori.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {kategori.icon} {kategori.name}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Product Grid */}
        {ilanlar.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {ilanlar.map((ilan) => (
              <div
                key={ilan._id}
                onClick={() => handleIlanClick(ilan)}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Clean Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-48'}`}>
                  {ilan.resimler && ilan.resimler.length > 0 ? (
                    <img
                      src={ilan.resimler[0]}
                      alt={ilan.baslik}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FaImage className="text-gray-400 text-2xl" />
                    </div>
                  )}
                  
                  {/* Minimal Status Badge */}
                  {ilan.satildi && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Satıldı
                    </div>
                  )}

                  {/* Minimal Action Buttons */}
                  <div className="absolute top-3 left-3 space-y-2">
                    <button
                      onClick={(e) => handleLike(e, ilan._id)}
                      className={`p-2 rounded-full shadow-sm transition-all duration-200 ${
                        likedItems.has(ilan._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Clean Product Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className={`font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 ${
                    viewMode === 'list' ? 'text-lg' : 'text-base'
                  }`}>
                    {ilan.baslik}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {ilan.aciklama}
                  </p>

                  {/* Clean Price and Location */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`font-semibold text-blue-600 dark:text-blue-400 ${
                      viewMode === 'list' ? 'text-xl' : 'text-lg'
                    }`}>
                      ₺{ilan.fiyat.toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaMapMarkerAlt className="mr-1" />
                      {ilan.konum}
                    </div>
                  </div>

                  {/* Clean Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <FaUser className="mr-1" />
                      {ilan.kullaniciAdi}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {new Date(ilan.tarih).toLocaleDateString('tr-TR')}
                    </div>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleContact(e, ilan)}
                      className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm"
                    >
                      <FaPhone className="inline mr-1" />
                      Ara
                    </button>
                    <button
                      onClick={(e) => handleWhatsApp(e, ilan)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 text-sm"
                    >
                      <FaWhatsapp className="inline mr-1" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <FaSearch className="text-gray-300 dark:text-gray-600 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                İlan bulunamadı
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Arama kriterlerine uygun ilan bulunamadı.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
              >
                Filtreleri temizle
              </button>
            </div>
          </div>
        )}

        {/* Clean Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FaChevronLeft />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FaChevronRight />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default Kesfet 