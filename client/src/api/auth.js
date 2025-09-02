import axios from 'axios'

// API base URL - production için Render URL'inizi kullanın
import API_BASE_URL from '../config/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth servisleri
export const authService = {
  // Giriş yap
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Kayıt ol
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Profil güncelle
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Çıkış yap
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Mevcut kullanıcıyı getir
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Token'ı getir
  getToken: () => {
    return localStorage.getItem('token')
  }
}

export default api 