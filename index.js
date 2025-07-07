const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 4000;

// Kendi API key'ini buraya yapıştır
const API_KEY = 'goldapi-kn2o8vsmctkvaan-io';

app.use(cors());
app.use(express.json());

async function getGoldPrice() {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': API_KEY }
    });
    return response.data.price; // API'den gelen gram altın fiyatı USD cinsinden
  } catch (error) {
    console.error('Altın fiyatı alınamadı:', error.message);
    return null;
  }
}

app.get('/products', async (req, res) => {
  try {
    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
    const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
    const goldPrice = await getGoldPrice();

    if (!goldPrice) {
      return res.status(500).json({ error: "Gold price not available" });
    }

    let calculatedProducts = products.map(p => ({
      ...p,
      price: parseFloat(((p.popularityScore + 1) * p.weight * goldPrice).toFixed(2)),
      popularityScore5: parseFloat((p.popularityScore * 5).toFixed(1)),
    }));

    // Filtreleme
    if (minPrice) {
      calculatedProducts = calculatedProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      calculatedProducts = calculatedProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (minPopularity) {
      calculatedProducts = calculatedProducts.filter(p => p.popularityScore5 >= parseFloat(minPopularity));
    }
    if (maxPopularity) {
      calculatedProducts = calculatedProducts.filter(p => p.popularityScore5 <= parseFloat(maxPopularity));
    }

    res.json(calculatedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/gold-price', async (req, res) => {
  try {
    const goldPrice = await getGoldPrice();
    if (!goldPrice) {
      return res.status(500).json({ error: "Gold price not available" });
    }
    res.json({ goldPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

