import axios from 'axios'

// API base URL - production için Render URL'inizi kullanın
import API_BASE_URL from '../config/api';

export const ilanService = {
  // Kullanıcının ilanlarını getir
  getMyIlanlar: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ilanlar/benim-ilanlarim`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Yeni ilan oluştur
  createIlan: async (ilanData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ilanlar`, ilanData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // İlan güncelle
  updateIlan: async (id, ilanData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/ilanlar/${id}`, ilanData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // İlan sil
  deleteIlan: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/ilanlar/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
} 