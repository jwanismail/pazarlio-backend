import React from 'react'

const Test = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Test Sayfası
        </h1>
        <p className="text-gray-600">
          Bu sayfa çalışıyorsa React düzgün yükleniyor demektir.
        </p>
        <div className="mt-8 p-4 bg-green-100 text-green-800 rounded">
          ✅ React çalışıyor!
        </div>
      </div>
    </div>
  )
}

export default Test
