import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";

const app = express();
const port = 3000;

// CORS ayarları - Tüm domain'leri kabul et
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://pazar-lio.com',
    'https://www.pazar-lio.com',
    'https://pazarlio.com',
    'https://www.pazarlio.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// LowDB setup
const file = join("server", "db.json"); // db.json yolunu ayarla
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Veritabanını başlat
await db.read();
db.data ||= { ilanlar: [] }; // Eğer ilanlar yoksa başlat

// Tüm ilanları getir
app.get("/ilanlar", (req, res) => {
  res.json(db.data.ilanlar);
});

// Yeni ilan ekle
app.post("/ilanlar", async (req, res) => {
  const yeniIlan = req.body;

  // Basit doğrulama
  if (
    !yeniIlan.baslik ||
    !yeniIlan.aciklama ||
    !yeniIlan.fiyat ||
    !yeniIlan.kategori ||
    !yeniIlan.iletisim
  ) {
    return res.status(400).json({ hata: "Eksik bilgi var." });
  }

  // İlanı ekle
  db.data.ilanlar.push({
    ...yeniIlan,
    id: Date.now(), // basit ID
    tarih: new Date().toISOString(),
  });

  await db.write();

  res.status(201).json({ mesaj: "İlan eklendi." });
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
