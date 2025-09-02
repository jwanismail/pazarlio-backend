import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaPlus, FaStar, FaMapMarkerAlt, FaTag, FaShieldAlt, FaUsers, FaHandshake, FaRocket } from 'react-icons/fa'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/20 dark:to-purple-400/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-4">
                <FaRocket className="mr-2 animate-pulse" />
                Türkiye'nin En Güvenilir İkinci El Platformu
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              PazarLio'ya
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Hoş Geldiniz</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Güvenli, hızlı ve kolay ikinci el alışveriş platformu. 
              <span className="font-semibold text-blue-600 dark:text-blue-400"> İhtiyacınız olan her şeyi bulun</span> veya 
              <span className="font-semibold text-purple-600 dark:text-purple-400"> kullanmadığınız eşyaları satın</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/kesfet"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaSearch className="mr-3 group-hover:animate-pulse" />
                Keşfet
              </Link>
              <Link
                to="/ilan-ver"
                className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="mr-3 group-hover:rotate-90 transition-transform duration-300" />
                İlan Ver
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Aktif Kullanıcı</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Başarılı Satış</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">99%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Güvenlik Oranı</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Neden <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PazarLio</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Platformumuzun sunduğu benzersiz avantajlar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: "Güvenli Alışveriş",
                description: "Doğrulanmış kullanıcılar ve güvenli ödeme sistemi ile güvenle alışveriş yapın.",
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: FaMapMarkerAlt,
                title: "Yerel Alışveriş",
                description: "Yakınınızdaki satıcılarla buluşun, nakliye masrafı olmadan alışveriş yapın.",
                color: "green",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: FaHandshake,
                title: "Uygun Fiyatlar",
                description: "İkinci el ürünlerde uygun fiyatlar ve pazarlık imkanı ile tasarruf edin.",
                color: "purple",
                gradient: "from-purple-500 to-purple-600"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Popüler <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kategoriler</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              İhtiyacınız olan kategorileri keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Yemek', color: 'from-orange-500 to-orange-600', icon: '🍕' },
              { name: 'Kozmetik', color: 'from-pink-500 to-pink-600', icon: '💄' },
              { name: 'Giyim', color: 'from-blue-500 to-blue-600', icon: '👕' },
              { name: 'Teknoloji', color: 'from-purple-500 to-purple-600', icon: '💻' },
              { name: 'Elektronik Sigara & Puff', color: 'from-gray-500 to-gray-600', icon: '💨' }
            ].map((category, index) => (
              <Link
                key={index}
                to="/kesfet"
                className={`group bg-gradient-to-r ${category.color} text-white p-8 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-bold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hemen <span className="text-yellow-300">Başlayın</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Kullanmadığınız eşyaları satın veya ihtiyacınız olan ürünleri bulun. 
            Binlerce kullanıcı gibi siz de PazarLio'ya katılın!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaUsers className="mr-3 group-hover:animate-pulse" />
              Ücretsiz Kayıt Ol
            </Link>
            <Link
              to="/kesfet"
              className="group inline-flex items-center px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              <FaSearch className="mr-3 group-hover:animate-pulse" />
              Hemen Keşfet
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 