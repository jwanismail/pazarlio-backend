import { useState } from 'react'

const Ilanlar = () => {
  const [ilanlar] = useState([
    {
      id: 1,
      baslik: 'iPhone 13 Pro Max',
      aciklama: 'Yeni, kutusunda, garantisi devam ediyor.',
      fiyat: 15000,
      kategori: 'Teknoloji',
      resim: 'https://via.placeholder.com/400x300'
    },
    {
      id: 2,
      baslik: 'Nike Spor Ayakkabı',
      aciklama: '42 numara, yeni, kutusunda',
      fiyat: 2500,
      kategori: 'Giyim',
      resim: 'https://via.placeholder.com/400x300'
    }
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Tüm İlanlar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ilanlar.map((ilan) => (
          <div key={ilan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src={ilan.resim}
              alt={ilan.baslik}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{ilan.baslik}</h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {ilan.kategori}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {ilan.aciklama}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">{ilan.fiyat.toLocaleString('tr-TR')} ₺</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  İletişime Geç
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Ilanlar 