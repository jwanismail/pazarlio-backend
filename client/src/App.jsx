import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import Test from './pages/Test'
import Kesfet from './pages/Kesfet'
import IlanEkle from './pages/IlanEkle'
import IlanDetay from './pages/IlanDetay'
import Ilanlarim from './pages/Ilanlarim'
import IlanDuzenle from './pages/IlanDuzenle'
import KullaniciBelirle from './pages/KullaniciBelirle'
import Login from './pages/Login'
import Register from './pages/Register'
import TelefonDogrulama from './pages/TelefonDogrulama'
import SifremiUnuttum from './pages/SifremiUnuttum'
import Profil from './pages/Profil'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = React.useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : true // Default to dark mode
  })
  
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode
      localStorage.setItem('darkMode', JSON.stringify(newMode))
      return newMode
    })
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Test />} />
              <Route path="/kesfet" element={<Kesfet />} />
              <Route path="/ilan-ver" element={<IlanEkle />} />
              <Route path="/ilan-detay/:id" element={<IlanDetay />} />
              <Route path="/ilanlarim" element={<Ilanlarim />} />
              <Route path="/ilan-duzenle/:id" element={<IlanDuzenle />} />
              <Route path="/kullanici-belirle" element={<KullaniciBelirle />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/telefon-dogrulama" element={<TelefonDogrulama />} />
              <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
