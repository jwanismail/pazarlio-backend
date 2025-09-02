import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaChartBar, 
  FaList, 
  FaUsers, 
  FaSignOutAlt, 
  FaTrash, 
  FaEdit, 
  FaEye, 
  FaBan, 
  FaStar,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSpinner,
  FaArrowLeft,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCrown,
  FaTrophy,
  FaGem
} from 'react-icons/fa'

const AdminPanel = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [ilanlar, setIlanlar] = useState([])
  const [kullanicilar, setKullanicilar] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteType, setDeleteType] = useState('')
  const [stats, setStats] = useState({
    totalIlanlar: 0,
    totalKullanicilar: 0,
    aktifIlanlar: 0,
    satilanIlanlar: 0
  })

  useEffect(() => {
    // Admin kontrolü
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      navigate('/admin-login')
      return
    }

    fetchData()
  }, [navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      // İlanları getir
      const ilanlarResponse = await fetch('http://localhost:5001/admin/ilanlar')
      const ilanlarData = await ilanlarResponse.json()
      setIlanlar(ilanlarData.ilanlar || [])

      // Kullanıcıları getir
      const kullanicilarResponse = await fetch('http://localhost:5001/admin/kullanicilar')
      const kullanicilarData = await kullanicilarResponse.json()
      setKullanicilar(kullanicilarData.kullanicilar || [])

      // İstatistikleri hesapla
      const aktifIlanlar = ilanlarData.ilanlar?.filter(ilan => !ilan.satildi).length || 0
      const satilanIlanlar = ilanlarData.ilanlar?.filter(ilan => ilan.satildi).length || 0

      setStats({
        totalIlanlar: ilanlarData.ilanlar?.length || 0,
        totalKullanicilar: kullanicilarData.kullanicilar?.length || 0,
        aktifIlanlar,
        satilanIlanlar
      })
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin-login')
  }

  const handleDelete = async (id, type) => {
    setLoading(true)
    try {
      const endpoint = type === 'ilan' ? 'admin/ilan-sil' : 'admin/kullanici-sil'
      const response = await fetch(`http://localhost:5001/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ id })
      })

      const data = await response.json()
      if (data.success) {
        fetchData() // Verileri yenile
        setShowDeleteModal(false)
        setSelectedItems([])
      }
    } catch (error) {
      console.error('Silme işlemi başarısız:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return

    setLoading(true)
    try {
      const endpoint = deleteType === 'ilan' ? 'admin/ilanlar-sil' : 'admin/kullanicilar-sil'
      const response = await fetch(`http://localhost:5001/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ ids: selectedItems })
      })

      const data = await response.json()
      if (data.success) {
        fetchData()
        setShowDeleteModal(false)
        setSelectedItems([])
      }
    } catch (error) {
      console.error('Toplu silme işlemi başarısız:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePromoteIlan = async (id) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/admin/ilan-one-cikar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ id })
      })

      const data = await response.json()
      if (data.success) {
        fetchData()
      }
    } catch (error) {
      console.error('İlan öne çıkarma başarısız:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (id) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/admin/kullanici-engelle', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ id })
      })

      const data = await response.json()
      if (data.success) {
        fetchData()
      }
    } catch (error) {
      console.error('Kullanıcı engelleme başarısız:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIlanlar = ilanlar.filter(ilan => {
    const matchesSearch = ilan.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ilan.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ilan.konum.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterType === 'all') return matchesSearch
    if (filterType === 'active') return matchesSearch && !ilan.satildi
    if (filterType === 'sold') return matchesSearch && ilan.satildi
    if (filterType === 'featured') return matchesSearch && ilan.oneCikarilmis
    return matchesSearch
  })

  const filteredKullanicilar = kullanicilar.filter(kullanici => {
    return kullanici.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
           kullanici.soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
           kullanici.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FaChartBar },
    { id: 'ilanlar', name: 'İlanlar', icon: FaList },
    { id: 'kullanicilar', name: 'Kullanıcılar', icon: FaUsers }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaShieldAlt className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Yönetici Paneli
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <FaSignOutAlt className="mr-2" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600 dark:text-red-400'
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
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FaList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam İlan</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalIlanlar}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FaUsers className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Toplam Kullanıcı</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalKullanicilar}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <FaStar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktif İlanlar</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.aktifIlanlar}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FaCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Satılan İlanlar</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.satilanIlanlar}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ilanlar' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">İlan Yönetimi</h2>
              <div className="flex space-x-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="sold">Satılan</option>
                  <option value="featured">Öne Çıkan</option>
                </select>
                <input
                  type="text"
                  placeholder="İlan ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <FaSpinner className="animate-spin h-8 w-8 text-red-600" />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        İlan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Fiyat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredIlanlar.map((ilan) => (
                      <tr key={ilan._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={ilan.resimler?.[0] || '/placeholder.png'}
                                alt={ilan.baslik}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {ilan.baslik}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {ilan.konum}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {ilan.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {ilan.fiyat} ₺
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ilan.satildi ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                              Satıldı
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Aktif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePromoteIlan(ilan._id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              title="Öne Çıkar"
                            >
                              <FaStar />
                            </button>
                            <button
                              onClick={() => handleDelete(ilan._id, 'ilan')}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              title="Sil"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'kullanicilar' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kullanıcı Yönetimi</h2>
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {loading ? (
              <div className="flex justify-center">
                <FaSpinner className="animate-spin h-8 w-8 text-red-600" />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        E-posta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Telefon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredKullanicilar.map((kullanici) => (
                      <tr key={kullanici._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                <FaUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {kullanici.ad} {kullanici.soyad}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {kullanici.konum || 'Konum belirtilmemiş'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {kullanici.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {kullanici.telefon}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {kullanici.engellendi ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                              Engellendi
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Aktif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleBanUser(kullanici._id)}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                              title={kullanici.engellendi ? "Engeli Kaldır" : "Engelle"}
                            >
                              <FaBan />
                            </button>
                            <button
                              onClick={() => handleDelete(kullanici._id, 'kullanici')}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              title="Sil"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3 text-center">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">
                Emin misiniz?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Bu işlem geri alınamaz. Seçili {deleteType === 'ilan' ? 'ilanlar' : 'kullanıcılar'} kalıcı olarak silinecektir.
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  İptal
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
