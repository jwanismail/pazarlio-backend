import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const categories = [
    { id: 'elektronik', name: 'Elektronik', icon: '📱', color: 'from-blue-500 to-blue-600', darkColor: 'from-blue-600 to-blue-700' },
    { id: 'ev', name: 'Ev & Yaşam', icon: '🏠', color: 'from-green-500 to-green-600', darkColor: 'from-green-600 to-green-700' },
    { id: 'giyim', name: 'Giyim', icon: '👕', color: 'from-purple-500 to-purple-600', darkColor: 'from-purple-600 to-purple-700' },
    { id: 'spor', name: 'Spor', icon: '⚽', color: 'from-orange-500 to-orange-600', darkColor: 'from-orange-600 to-orange-700' },
    { id: 'kitap', name: 'Kitap', icon: '📚', color: 'from-red-500 to-red-600', darkColor: 'from-red-600 to-red-700' },
    { id: 'diger', name: 'Diğer', icon: '📦', color: 'from-gray-500 to-gray-600', darkColor: 'from-gray-600 to-gray-700' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
          
          {/* Animated Waves */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-32 text-white/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                className="animate-wave"
              />
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.71,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                className="animate-wave"
                style={{ animationDelay: '1s' }}
              />
              <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                className="animate-wave"
                style={{ animationDelay: '2s' }}
              />
            </svg>
          </div>
        </div>
        
        <div className="relative py-12 sm:py-16 md:py-20 lg:py-24 text-center px-4">
          <div className="max-w-4xl mx-auto">
            {/* Logo Animation */}
            <div className="mb-8 animate-logo-bounce">
              <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            
            {/* Main Title with Typewriter Effect */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-title-slide-in">
              <span className="inline-block animate-text-glow">Pazar</span>
              <span className="inline-block ml-2 animate-text-glow-delayed">Lio</span>
            </h1>
            
            {/* Subtitle with Fade In */}
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2 animate-subtitle-fade-in">
              Türkiye'nin en güvenilir ikinci el alışveriş platformu. 
              <span className="block mt-2 animate-pulse">Güvenle al, güvenle sat.</span>
            </p>
            
            {/* Buttons with Staggered Animation */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              {user ? (
                <Link 
                  to="/ilan-ekle" 
                  className="btn-primary btn-glow w-full sm:w-auto text-center animate-button-slide-up"
                >
                  <span className="btn-content">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    İlan Ekle
                  </span>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="btn-primary btn-glow w-full sm:w-auto text-center animate-button-slide-up"
                  >
                    <span className="btn-content">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Hemen Başla
                    </span>
                  </Link>
                  <Link 
                    to="/login" 
                    className="btn-secondary btn-outline w-full sm:w-auto text-center animate-button-slide-up-delayed"
                  >
                    <span className="btn-content">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                      </svg>
                      Giriş Yap
                    </span>
                  </Link>
                </>
              )}
            </div>
            
            {/* Scroll Indicator */}
            <div className="mt-12 animate-bounce">
              <div className="flex flex-col items-center text-white/60">
                <span className="text-sm mb-2">Aşağı kaydırın</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up animation-delay-600">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Popüler Kategoriler
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
              İhtiyacınız olan her şeyi kategorilere göre kolayca bulun
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to="/kesfet"
                className="group animate-fade-in-up hover:scale-110 transition-transform duration-300"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="category-card">
                  <div className={`category-icon bg-gradient-to-br ${category.color} dark:${category.darkColor} group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl sm:text-3xl">{category.icon}</span>
                  </div>
                  <h3 className="category-title text-xs sm:text-sm md:text-base">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up animation-delay-800">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Neden PazarLio?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
              Güvenli, hızlı ve kolay ikinci el alışveriş deneyimi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="feature-card animate-fade-in-up animation-delay-1000 hover:scale-105 transition-transform duration-300">
              <div className="feature-icon bg-blue-100 dark:bg-blue-900 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="feature-title text-lg sm:text-xl md:text-2xl">Güvenli Alışveriş</h3>
              <p className="feature-description text-sm sm:text-base">
                Kullanıcı doğrulama ve güvenli ödeme sistemi ile güvenle alışveriş yapın.
              </p>
            </div>
            
            <div className="feature-card animate-fade-in-up animation-delay-1200 hover:scale-105 transition-transform duration-300">
              <div className="feature-icon bg-green-100 dark:bg-green-900 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="feature-title text-lg sm:text-xl md:text-2xl">Hızlı İlan</h3>
              <p className="feature-description text-sm sm:text-base">
                Birkaç dakikada ilanınızı oluşturun ve satışa başlayın.
              </p>
            </div>
            
            <div className="feature-card animate-fade-in-up animation-delay-1400 hover:scale-105 transition-transform duration-300">
              <div className="feature-icon bg-purple-100 dark:bg-purple-900 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
                </svg>
              </div>
              <h3 className="feature-title text-lg sm:text-xl md:text-2xl">7/24 Destek</h3>
              <p className="feature-description text-sm sm:text-base">
                Müşteri hizmetleri ekibimiz her zaman yanınızda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 py-12 sm:py-16 md:py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'pattern-move 20s linear infinite'
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in-up animation-delay-2000">
            Hemen İlan Verin!
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2 animate-fade-in-up animation-delay-2200">
            Kullanmadığınız eşyaları satın, yeni fırsatlar keşfedin.
          </p>
          <Link 
            to="/ilan-ekle" 
            className="btn-primary btn-glow inline-block w-full sm:w-auto text-center animate-fade-in-up animation-delay-2400 hover:scale-105 transition-transform duration-300"
          >
            <span className="btn-content">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              İlan Ekle
            </span>
          </Link>
        </div>
      </div>

      {/* Floating Action Button */}
      {user && (
        <Link
          to="/ilan-ekle"
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 btn-glow animate-pulse"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </Link>
      )}
    </div>
  );
};

export default Home; 