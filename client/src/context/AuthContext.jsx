import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

// API URL'ini config'den al
import API_URL from '../config/api.js'

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini al
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        // Eğer token ayrı saklanmışsa birleştir
        if (!userData.token) {
          const savedToken = localStorage.getItem('token')
          if (savedToken) {
            userData.token = savedToken
          }
        }
        setUser(userData)
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error)
      // Hatalı veri varsa temizle
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, sifre) => {
    try {
      const response = await axios.post(`${API_URL}/giris`, {
        emailOrPhone: email, // Backend'de hala emailOrPhone olarak gönderiyoruz ama sadece email kabul ediyoruz
        sifre
      })
      const userData = response.data
      // Token'ı user objesi içine dahil et
      const userWithToken = {
        ...userData.user,
        token: userData.token
      }
      setUser(userWithToken)
      localStorage.setItem('user', JSON.stringify(userWithToken))
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Giriş yapılırken bir hata oluştu'
      }
    }
  }

  const register = async (ad, soyad, email, telefon, il, yurt, sifre) => {
    try {
      const response = await axios.post(`${API_URL}/kayit`, {
        ad,
        soyad,
        email,
        telefon,
        il,
        yurt,
        sifre
      })
      const userData = response.data
      // Token'ı user objesi içine dahil et
      const userWithToken = {
        ...userData.user,
        token: userData.token
      }
      setUser(userWithToken)
      localStorage.setItem('user', JSON.stringify(userWithToken))
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Kayıt olurken bir hata oluştu'
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // Token doğrulama ve temizleme fonksiyonu
  const validateAndCleanToken = () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (!userData.token) {
          // Token eksikse logout yap
          logout()
          return false
        }
        return true
      }
    } catch (error) {
      console.error('Token doğrulama hatası:', error)
      logout()
      return false
    }
    return false
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    validateAndCleanToken
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 