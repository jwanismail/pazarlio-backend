import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMobile, FaKey, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const TelefonDogrulama = () => {
  const [telefon, setTelefon] = useState('');
  const [dogrulamaKodu, setDogrulamaKodu] = useState('');
  const [kodGonderildi, setKodGonderildi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Geri sayım için useEffect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Doğrulama kodu gönder
  const handleKodGonder = async () => {
    if (!telefon.trim()) {
      setError('Lütfen telefon numaranızı girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dogrulama-kodu-gonder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefon }),
      });

      const data = await response.json();

      if (response.ok) {
        setKodGonderildi(true);
        setSuccess(data.message);
        setCountdown(60); // 60 saniye geri sayım
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Doğrulama kodu ile giriş
  const handleDogrulama = async () => {
    if (!dogrulamaKodu.trim()) {
      setError('Lütfen doğrulama kodunu girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dogrulama-kodu-giris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefon, dogrulamaKodu }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Giriş başarılı!');
        // AuthContext kullanarak kullanıcıyı ayarla
        const userWithToken = {
          ...data.user,
          token: data.token
        }
        localStorage.setItem('user', JSON.stringify(userWithToken))
        setTimeout(() => {
          window.location.reload() // Context'in güncellenmesi için sayfayı yenile
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FaMobile className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Telefon Doğrulama</h1>
          <p className="text-gray-600">Telefon numaranıza gönderilen kodu girin</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {!kodGonderildi ? (
            // Telefon numarası girişi
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <FaMobile className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleKodGonder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
              </motion.button>
            </div>
          ) : (
            // Doğrulama kodu girişi
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCheckCircle className="text-green-500 text-xl" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {success}
                </p>
                <p className="text-xs text-gray-500">
                  Telefon: {telefon.replace(/(\d{3})(\d{3})(\d{4})/, '$1 *** $3')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doğrulama Kodu
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dogrulamaKodu}
                    onChange={(e) => setDogrulamaKodu(e.target.value)}
                    placeholder="6 haneli kodu girin"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                  />
                  <FaKey className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDogrulama}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
              </motion.button>

              {/* Yeniden kod gönder */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Yeni kod gönderebilmek için {countdown} saniye bekleyin
                  </p>
                ) : (
                  <button
                    onClick={handleKodGonder}
                    disabled={loading}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
                  >
                    Yeni kod gönder
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Hata mesajı */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2"
            >
              <FaTimesCircle className="text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Başarı mesajı */}
          {success && !kodGonderildi && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2"
            >
              <FaCheckCircle className="text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Geri dön butonu */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/giris')}
          className="mt-6 w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <FaArrowLeft className="text-sm" />
          <span>Giriş sayfasına dön</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TelefonDogrulama; 