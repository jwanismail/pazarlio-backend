import { useState, useEffect } from 'react'

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Animasyon başlangıcı
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 500)

    // Progress animasyonu
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Loading tamamlandığında
          setTimeout(() => {
            onLoadingComplete()
          }, 1000)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
        {/* Logo Container */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Logo Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            
            {/* Main Logo */}
            <div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 relative">
                {/* PazarLio Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    P
                  </div>
                </div>
                
                {/* Animated Ring */}
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 border-4 border-purple-500 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-4 border-4 border-indigo-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            PazarLio
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-blue-200 mb-8 animate-fade-in animation-delay-500">
          İkinci El Alışveriş Platformu
        </p>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-8">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-blue-200 text-sm">
            Yükleniyor... {Math.round(progress)}%
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center animate-fade-in animation-delay-1000">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-blue-200 text-sm">Kolay Arama</p>
          </div>
          
          <div className="text-center animate-fade-in animation-delay-1200">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-purple-200 text-sm">Güvenli Alışveriş</p>
          </div>
          
          <div className="text-center animate-fade-in animation-delay-1400">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-indigo-200 text-sm">Hızlı İletişim</p>
          </div>
        </div>
      </div>

      {/* Completion Animation */}
      {progress >= 100 && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center animate-fade-out">
          <div className="text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz!</h2>
            <p className="text-blue-200">PazarLio'ya başarıyla giriş yapıldı</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingScreen 