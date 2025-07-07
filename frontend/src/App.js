import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FaChevronLeft, FaChevronRight, FaFilter, FaTimes } from 'react-icons/fa';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minPopularity: '',
    maxPopularity: ''
  });
  const [visibleStart, setVisibleStart] = useState(0);
  const visibleCount = 4; // Aynı anda gösterilecek kart sayısı

  const colors = ['yellow', 'rose', 'white'];
  const colorNames = { yellow: 'Sarı', rose: 'Pembe', white: 'Beyaz' };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`http://localhost:4000/products?${params}`);
      const data = await response.json();
      setProducts(data);
      const initialColors = {};
      data.forEach((_, idx) => { initialColors[idx] = 'yellow'; });
      setSelectedColors(initialColors);
    } catch (err) {
      console.error('API error:', err);
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      setCurrentImageIndex((prev) => (prev + 1) % 3);
    } else if (direction === 'right') {
      setCurrentImageIndex((prev) => (prev - 1 + 3) % 3);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const handleColorChange = (idx, color) => {
    setSelectedColors(prev => ({ ...prev, [idx]: color }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minPopularity: '',
      maxPopularity: ''
    });
  };

  const handleMainArrow = (direction) => {
    if (direction === 'left') {
      setVisibleStart((prev) => Math.max(prev - visibleCount, 0));
    } else if (direction === 'right') {
      setVisibleStart((prev) =>
        Math.min(prev + visibleCount, Math.max(products.length - visibleCount, 0))
      );
    }
  };

  return (
    <div className="app" style={{ position: 'relative' }}>
      {/* Büyük oklar */}
      {products.length > visibleCount && (
        <>
          <button
            className="main-carousel-btn main-prev"
            onClick={() => handleMainArrow('left')}
            style={{ position: 'absolute', left: 0, top: '45%', zIndex: 10 }}
            aria-label="Geri"
            disabled={visibleStart === 0}
          >
            <FaChevronLeft size={40} />
          </button>
          <button
            className="main-carousel-btn main-next"
            onClick={() => handleMainArrow('right')}
            style={{ position: 'absolute', right: 0, top: '45%', zIndex: 10 }}
            aria-label="İleri"
            disabled={visibleStart >= products.length - visibleCount}
          >
            <FaChevronRight size={40} />
          </button>
        </>
      )}
      <header className="header">
        <h1>💍 Yüzük Koleksiyonu</h1>
        <button
          className="filter-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filtrele
        </button>
      </header>

      {showFilters && (
        <div className="filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Min Fiyat ($)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min fiyat"
              />
            </div>
            <div className="filter-group">
              <label>Max Fiyat ($)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max fiyat"
              />
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label>Min Popülerlik (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={filters.minPopularity}
                onChange={(e) => handleFilterChange('minPopularity', e.target.value)}
                placeholder="Min popülerlik"
              />
            </div>
            <div className="filter-group">
              <label>Max Popülerlik (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={filters.maxPopularity}
                onChange={(e) => handleFilterChange('maxPopularity', e.target.value)}
                placeholder="Max popülerlik"
              />
            </div>
          </div>
          <button className="clear-filters" onClick={clearFilters}>
            <FaTimes /> Filtreleri Temizle
          </button>
        </div>
      )}

      <div className="products-grid">
        {products.slice(visibleStart, visibleStart + visibleCount).map((product, idx) => {
          const realIdx = visibleStart + idx;
          const selectedColor = selectedColors[realIdx] || 'yellow';
          return (
            <div key={realIdx} className="product-card">
              <div className="product-image-container" style={{ width: 220, height: 220 }}>
                <img
                  src={product.images[selectedColor]}
                  alt={product.name}
                  className="product-image"
                  style={{ width: 190, height: 190 }}
                />
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="price-section">
                  <span className="price">${product.price}</span>
                  <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 6 }}>USD</span>
                </div>
                <div className="color-picker">
                  <div className="color-options">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => handleColorChange(realIdx, color)}
                        title={color === 'yellow' ? 'Sarı' : color === 'rose' ? 'Pembe' : 'Beyaz'}
                        style={{
                          borderColor: selectedColor === color ? '#222' : '#eee',
                          boxShadow: selectedColor === color ? '0 0 0 2px #E6CA97' : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <span className="color-name">
                    {selectedColor === 'yellow' && 'Yellow Gold'}
                    {selectedColor === 'rose' && 'Rose Gold'}
                    {selectedColor === 'white' && 'White Gold'}
                  </span>
                </div>
                <div className="popularity-section">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= Math.round(product.popularityScore5) ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="popularity-score">{product.popularityScore5}/5</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>Filtrelerinize uygun ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

export default App;
