import { useState, useEffect } from 'react'

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)

  const loadingSteps = [
    "Sistem başlatılıyor...",
    "Veritabanı bağlantısı kuruluyor...",
    "Güvenlik kontrolleri yapılıyor...",
    "Arayüz yükleniyor...",
    "Son kontroller...",
    "Hazır!"
  ]

  useEffect(() => {
    // Animasyon başlangıcı
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)

    // Progress animasyonu
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setShowCompletion(true)
          // Loading tamamlandığında
          setTimeout(() => {
            onLoadingComplete()
          }, 2000)
          return 100
        }
        return prev + Math.random() * 8 + 2
      })
    }, 150)

    // Loading steps animasyonu
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval)
          return loadingSteps.length - 1
        }
        return prev + 1
      })
    }, 800)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [onLoadingComplete, loadingSteps.length])

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {/* Floating Orbs - PC'de büyük, mobilde küçük */}
        <div className="absolute top-20 left-20 w-32 h-32 md:w-32 md:h-32 sm:w-20 sm:h-20 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 md:w-24 md:h-24 sm:w-16 sm:h-16 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-float-medium"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 md:w-28 md:h-28 sm:w-18 sm:h-18 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-xl animate-float-fast"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 md:w-20 md:h-20 sm:w-14 sm:h-14 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
        
        {/* Grid Pattern - Mobilde gizle */}
        <div className="absolute inset-0 opacity-10 hidden sm:block">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'pattern-move 30s linear infinite'
          }} />
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 px-4 sm:px-0 ${showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
        {/* Modern Logo Container - Mobilde küçült */}
        <div className="mb-8 sm:mb-12">
          <div className="relative inline-block">
            {/* Outer Glow Ring - Mobilde azalt */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full blur-2xl sm:blur-3xl opacity-40 sm:opacity-60 animate-pulse"></div>
            
            {/* Main Logo Container - Mobilde küçült */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-500">
              <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
                {/* PazarLio Logo - Mobilde küçük font */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-text-glow">
                    P
                  </div>
                </div>
                
                {/* Animated Rings - Mobilde daha az halka */}
                <div className="absolute inset-0 border-3 sm:border-4 border-blue-400/50 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
                <div className="absolute inset-2 sm:inset-2 border-3 sm:border-4 border-purple-400/50 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-4 sm:inset-4 border-3 sm:border-4 border-indigo-400/50 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                {/* Mobilde 4. halkayı gizle */}
                <div className="absolute inset-6 border-3 sm:border-4 border-cyan-400/50 rounded-full animate-spin hidden sm:block" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                
                {/* Center Pulse - Mobilde küçült */}
                <div className="absolute inset-6 sm:inset-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Title with Modern Typography - Mobilde küçült */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 animate-title-slide-in">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-text-glow">
            Pazar
          </span>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-text-glow-delayed ml-1 sm:ml-2">
            Lio
          </span>
        </h1>

        {/* Subtitle - Mobilde küçült */}
        <p className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-6 sm:mb-10 animate-subtitle-fade-in font-medium px-2 sm:px-0">
          Türkiye'nin En Güvenilir İkinci El Alışveriş Platformu
        </p>

        {/* Current Loading Step - Mobilde optimize et */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2 sm:mr-3"></div>
            <span className="text-blue-200 font-medium text-sm sm:text-base">{loadingSteps[currentStep]}</span>
          </div>
        </div>

        {/* Modern Progress Bar - Mobilde küçült */}
        <div className="w-72 sm:w-96 mx-auto mb-8 sm:mb-10">
          <div className="relative">
            {/* Background Track */}
            <div className="bg-white/10 backdrop-blur-sm rounded-full h-2 sm:h-3 overflow-hidden border border-white/20">
              {/* Progress Fill */}
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            {/* Progress Percentage */}
            <div className="mt-2 sm:mt-3 text-center">
              <span className="text-blue-200 font-bold text-base sm:text-lg">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Modern Loading Dots - Mobilde azalt */}
        <div className="flex justify-center space-x-2 sm:space-x-3 mb-8 sm:mb-12">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                i <= Math.floor(progress / 16.67) 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 scale-125' 
                  : 'bg-white/30 scale-100'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Feature Cards Grid - Mobilde tek sütun */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-xs sm:max-w-3xl mx-auto">
          {[
            { icon: "🔍", title: "Akıllı Arama", desc: "AI destekli filtreleme" },
            { icon: "🛡️", title: "Güvenli Ödeme", desc: "SSL şifreleme" },
            { icon: "⚡", title: "Hızlı İletişim", desc: "Anlık mesajlaşma" }
          ].map((feature, index) => (
            <div 
              key={index}
              className="text-center animate-fade-in-up hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${1000 + index * 200}ms` }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-white/20">
                <span className="text-xl sm:text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-blue-200 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
              <p className="text-blue-300/80 text-xs sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Animation - Mobilde optimize et */}
      {showCompletion && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center animate-completion-fade-in px-4 sm:px-0">
          <div className="text-center">
            {/* Success Icon - Mobilde küçült */}
            <div className="relative mb-6 sm:mb-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border border-white/30 animate-scale-in">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-bounce">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {/* Success Rings - Mobilde azalt */}
              <div className="absolute inset-0 border-3 sm:border-4 border-green-400/50 rounded-full animate-ping"></div>
              <div className="absolute inset-3 sm:inset-4 border-3 sm:border-4 border-emerald-400/50 rounded-full animate-ping hidden sm:block" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Success Message - Mobilde küçült */}
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4 animate-fade-in-up">Hoş Geldiniz!</h2>
            <p className="text-green-200 text-lg sm:text-xl font-medium animate-fade-in-up animation-delay-200">
              PazarLio'ya başarıyla giriş yapıldı
            </p>
            <p className="text-green-300/80 mt-2 animate-fade-in-up animation-delay-400 text-sm sm:text-base">
              Güvenli alışveriş deneyiminiz başlıyor...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingScreen 