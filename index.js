const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

// CORS ayarları (hem global hem middleware)
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Ring API is running!',
    endpoints: {
      products: '/products',
      goldPrice: '/gold-price'
    },
    status: 'active'
  });
});

const API_KEY = 'goldapi-kn2o8vsmctkvaan-io';

async function getGoldPrice() {
  try {
    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': API_KEY }
    });
    return response.data.price;
  } catch (error) {
    console.error('Altın fiyatı alınamadı:', error.message);
    return null;
  }
}

app.get('/products', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
    const productsPath = path.join(__dirname, 'products.json');
    if (!fs.existsSync(productsPath)) {
      return res.status(500).json({ error: 'products.json not found' });
    }
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const goldPrice = await getGoldPrice();

    if (!goldPrice) {
      return res.status(500).json({ error: "Gold price not available" });
    }

    let calculatedProducts = products.map(p => ({
      ...p,
      price: parseFloat(((p.popularityScore + 1) * p.weight * goldPrice).toFixed(2)),
      popularityScore5: parseFloat((p.popularityScore * 5).toFixed(1)),
    }));

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
  console.log(`Server running on port ${port}`);
});

