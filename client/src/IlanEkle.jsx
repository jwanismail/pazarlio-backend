import React, { useState } from "react";

const IlanEkle = () => {
  const [formData, setFormData] = useState({
    baslik: "",
    aciklama: "",
    fiyat: "",
    kategori: "",
    iletisim: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/ilanlar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("İlan başarıyla eklendi!");
      setFormData({
        baslik: "",
        aciklama: "",
        fiyat: "",
        kategori: "",
        iletisim: ""
      });
    } else {
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Yeni İlan Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="baslik" value={formData.baslik} onChange={handleChange} placeholder="Başlık" required className="w-full border p-2" />
        <textarea name="aciklama" value={formData.aciklama} onChange={handleChange} placeholder="Açıklama" required className="w-full border p-2" />
        <input name="fiyat" value={formData.fiyat} onChange={handleChange} placeholder="Fiyat" type="number" required className="w-full border p-2" />
        <input name="kategori" value={formData.kategori} onChange={handleChange} placeholder="Kategori" required className="w-full border p-2" />
        <input name="iletisim" value={formData.iletisim} onChange={handleChange} placeholder="İletişim Bilgisi" required className="w-full border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">İlan Ekle</button>
      </form>
    </div>
  );
};

export default IlanEkle;
