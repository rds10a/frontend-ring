# 💍 Yüzük Koleksiyonu - Product Listing Application

Modern ve responsive bir ürün listeleme uygulaması. Backend API ve frontend arayüzünden oluşur.

## 🚀 Özellikler

### Backend
- ✅ RESTful API
- ✅ Gerçek zamanlı altın fiyatı entegrasyonu
- ✅ Dinamik fiyat hesaplama
- ✅ Filtreleme özellikleri (fiyat aralığı, popülerlik)
- ✅ CORS desteği

### Frontend
- ✅ Modern ve responsive tasarım
- ✅ Carousel/slider özelliği
- ✅ Renk seçici (Sarı, Pembe, Beyaz)
- ✅ Swipe desteği (mobil ve desktop)
- ✅ Filtreleme arayüzü
- ✅ Yıldız sistemi ile popülerlik gösterimi
- ✅ Hover efektleri ve animasyonlar

## 🛠️ Teknolojiler

### Backend
- Node.js
- Express.js
- Axios (API çağrıları)
- CORS

### Frontend
- React.js
- React Icons
- React Swipeable
- CSS3 (Modern stiller)

## 📦 Kurulum

### Backend Kurulumu

```bash
# Ana dizinde
npm install
npm start
```

Backend `http://localhost:4000` adresinde çalışacak.

### Frontend Kurulumu

```bash
# Frontend dizininde
cd frontend
npm install
npm start
```

Frontend `http://localhost:3000` adresinde çalışacak.

## 🔧 API Endpoints

### GET /products
Ürünleri getirir. Filtreleme parametreleri:

- `minPrice`: Minimum fiyat
- `maxPrice`: Maksimum fiyat  
- `minPopularity`: Minimum popülerlik (1-5)
- `maxPopularity`: Maksimum popülerlik (1-5)

**Örnek:**
```
GET /products?minPrice=100&maxPrice=500&minPopularity=3.5
```

### GET /gold-price
Güncel altın fiyatını getirir.

## 💰 Fiyat Hesaplama

Fiyat şu formülle hesaplanır:
```
Price = (popularityScore + 1) × weight × goldPrice
```

- `popularityScore`: 0-1 arası popülerlik skoru
- `weight`: Gram cinsinden ağırlık
- `goldPrice`: USD/gram altın fiyatı

## 🎨 Kullanıcı Arayüzü

### Özellikler
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Carousel**: Ok tuşları ve swipe ile gezinme
- **Renk Seçici**: Sarı, Pembe, Beyaz seçenekleri
- **Filtreleme**: Fiyat ve popülerlik bazında filtreleme
- **Yıldız Sistemi**: Popülerlik skorunu görsel olarak gösterim

### Renk Seçenekleri
- 🟡 Sarı (Yellow)
- 🟣 Pembe (Rose) 
- ⚪ Beyaz (White)

## 📱 Responsive Tasarım

- **Desktop**: 3 sütunlu grid layout
- **Tablet**: 2 sütunlu layout
- **Mobil**: Tek sütunlu layout

## 🔄 Swipe Özelliği

- **Mobil**: Dokunmatik swipe desteği
- **Desktop**: Mouse ile sürükleme
- **Oklar**: Klavye ve mouse ile gezinme

## 🚀 Deployment

### Backend (Heroku)
```bash
# package.json'da start script'i mevcut
git push heroku main
```

### Frontend (Vercel)
```bash
# Vercel CLI ile
vercel --prod
```

## 📝 Lisans

ISC License

## 👨‍💻 Geliştirici

Bu proje modern web teknolojileri kullanılarak geliştirilmiştir.

---

**Not**: Altın fiyatı için gerçek zamanlı API kullanılmaktadır. API anahtarı gerekebilir. 