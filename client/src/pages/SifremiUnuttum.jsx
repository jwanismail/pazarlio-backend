import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaMobile, FaKey, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const SifremiUnuttum = () => {
  const [step, setStep] = useState('phone'); // 'phone', 'verification', 'newPassword'
  const [telefon, setTelefon] = useState('');
  const [dogrulamaKodu, setDogrulamaKodu] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  // Geri sayım için useEffect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Şifre sıfırlama kodu gönder
  const handleSendResetCode = async () => {
    if (!telefon.trim()) {
      setError('Lütfen telefon numaranızı girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/sifremi-unuttum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefon }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('verification');
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

  // Doğrulama kodu ile doğrula
  const handleVerifyCode = async () => {
    if (!dogrulamaKodu.trim()) {
      setError('Lütfen doğrulama kodunu girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/sifre-sifirlama-dogrula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefon, dogrulamaKodu }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
        setStep('newPassword');
        setSuccess(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Yeni şifre belirle
  const handleSetNewPassword = async () => {
    if (!yeniSifre.trim() || !yeniSifreTekrar.trim()) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (yeniSifre !== yeniSifreTekrar) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (yeniSifre.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/yeni-sifre-belirle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, yeniSifre }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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
    <>
      <Helmet>
        <title>Şifremi Unuttum - PazarLio | Şifre Sıfırlama</title>
        <meta name="description" content="PazarLio hesabınızın şifresini unuttunuz mu? Telefon numaranıza gönderilen doğrulama kodu ile güvenli şekilde şifrenizi sıfırlayın." />
        <meta name="keywords" content="şifremi unuttum, şifre sıfırlama, şifre değiştirme, PazarLio şifre, güvenli şifre sıfırlama" />
        <meta name="author" content="PazarLio" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="language" content="tr" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pazarlio.com/sifremi-unuttum" />
        <meta property="og:title" content="Şifremi Unuttum - PazarLio | Şifre Sıfırlama" />
        <meta property="og:description" content="PazarLio hesabınızın şifresini unuttunuz mu? Telefon numaranıza gönderilen doğrulama kodu ile güvenli şekilde şifrenizi sıfırlayın." />
        <meta property="og:image" content="https://pazarlio.com/sifremi-unuttum-og-image.jpg" />
        <meta property="og:site_name" content="PazarLio" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://pazarlio.com/sifremi-unuttum" />
        <meta property="twitter:title" content="Şifremi Unuttum - PazarLio | Şifre Sıfırlama" />
        <meta property="twitter:description" content="PazarLio hesabınızın şifresini unuttunuz mu? Telefon numaranıza gönderilen doğrulama kodu ile güvenli şekilde şifrenizi sıfırlayın." />
        <meta property="twitter:image" content="https://pazarlio.com/sifremi-unuttum-twitter-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://pazarlio.com/sifremi-unuttum" />
      </Helmet>
      
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
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FaKey className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Şifremi Unuttum</h1>
          <p className="text-gray-600">Şifrenizi sıfırlamak için telefon numaranızı girin</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 'phone' && (
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                  <FaMobile className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendResetCode}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 px-6 rounded-xl font-medium hover:from-red-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Kodu Gönder'}
              </motion.button>
            </div>
          )}

          {step === 'verification' && (
            // Doğrulama kodu girişi
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCheckCircle className="text-orange-500 text-xl" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                  />
                  <FaKey className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyCode}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Doğrulanıyor...' : 'Doğrula'}
              </motion.button>

              {/* Yeniden kod gönder */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Yeni kod gönderebilmek için {countdown} saniye bekleyin
                  </p>
                ) : (
                  <button
                    onClick={handleSendResetCode}
                    disabled={loading}
                    className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200"
                  >
                    Yeni kod gönder
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'newPassword' && (
            // Yeni şifre belirleme
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCheckCircle className="text-green-500 text-xl" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {success}
                </p>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Yeni Şifre Belirleyin
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={yeniSifre}
                    onChange={(e) => setYeniSifre(e.target.value)}
                    placeholder="Yeni şifrenizi girin"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre Tekrar
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={yeniSifreTekrar}
                    onChange={(e) => setYeniSifreTekrar(e.target.value)}
                    placeholder="Yeni şifrenizi tekrar girin"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSetNewPassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Şifre Güncelleniyor...' : 'Şifreyi Güncelle'}
              </motion.button>
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
          {success && step !== 'verification' && (
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
          onClick={() => navigate('/login')}
          className="mt-6 w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <FaArrowLeft className="text-sm" />
          <span>Giriş sayfasına dön</span>
        </motion.button>
      </motion.div>
    </div>
    </>
  );
};

export default SifremiUnuttum; 