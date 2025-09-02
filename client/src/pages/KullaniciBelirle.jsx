import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'

const KullaniciBelirle = () => {
  const navigate = useNavigate()
  const [kullaniciAdi, setKullaniciAdi] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!kullaniciAdi.trim()) {
      setError('Lütfen bir kullanıcı adı girin')
      return
    }

    // Kullanıcı adını kaydet
    localStorage.setItem('kullaniciAdi', kullaniciAdi.trim())
    // İlanlarım sayfasına yönlendir
    navigate('/ilanlarim')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Kullanıcı Adınızı Belirleyin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            İlanlarınızı yönetmek için bir kullanıcı adı belirleyin
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="kullaniciAdi" className="sr-only">Kullanıcı Adı</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="kullaniciAdi"
                name="kullaniciAdi"
                type="text"
                required
                value={kullaniciAdi}
                onChange={(e) => setKullaniciAdi(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Kullanıcı adı"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Devam Et
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default KullaniciBelirle 