import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaMapMarkerAlt, FaUser } from 'react-icons/fa'

const Explore = () => {
  const [ilanlar, setIlanlar] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    // localStorage'dan ilanları al
    const storedIlanlar = JSON.parse(localStorage.getItem('ilanlar') || '[]')
    setIlanlar(storedIlanlar)
    
    // Benzersiz kullanıcı adlarını al
    const uniqueUsers = [...new Set(storedIlanlar.map(ilan => ilan.kullaniciAdi))]
    setUsers(uniqueUsers)
    
    setLoading(false)
  }, [])

  // İlanları filtrele
  const filteredIlanlar = ilanlar.filter(ilan => {
    const matchesSearch = ilan.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ilan.aciklama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ilan.konum.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = !selectedUser || ilan.kullaniciAdi === selectedUser
    return matchesSearch && matchesUser
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Arama ve Filtreleme */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="İlan ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Tüm Kullanıcılar</option>
            {users.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        {/* İlan Listesi */}
        {filteredIlanlar.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIlanlar.map(ilan => (
              <Link
                key={ilan.id}
                to={`/ilan/${ilan.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  {ilan.resimler && ilan.resimler.length > 0 ? (
                    <img
                      src={ilan.resimler[0]}
                      alt={ilan.baslik}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">Resim Yok</span>
                    </div>
                  )}
                  {ilan.satildi && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      Satıldı
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {ilan.baslik}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {ilan.aciklama}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        {ilan.konum}
                      </span>
                      <span className="flex items-center">
                        <FaUser className="mr-1" />
                        {ilan.kullaniciAdi}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₺{ilan.fiyat}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              İlan Bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Arama kriterlerinize uygun ilan bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore 