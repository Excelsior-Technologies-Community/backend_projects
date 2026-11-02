import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Tag, X, Dumbbell } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const ShopPage = ({ products, categories, selectedCategory, onSelectProduct, onSelectCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState(300);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.categoryName?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Price filter
      if (item.price > priceRange) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // Default featured/newest
    });
  }, [products, activeCategory, searchQuery, priceRange, sortOption]);

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #121620 0%, #1a2230 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '2.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span className="badge-tag" style={{ marginBottom: '0.5rem' }}>Full Catalog</span>
          <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '0.4rem' }}>
            Athletic Gear &amp; Nutrition Store
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Explore high performance dumbbells, pure whey protein isolate, gym accessories, and custom workout programs.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search size={18} style={{ position: 'absolute', top: '12px', left: '14px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search barbell, whey, straps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 2.5rem 0.75rem 2.6rem',
              background: '#090c10',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: '#fff',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--text-dim)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Sidebar Filters */}
        <aside className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <SlidersHorizontal size={18} color="var(--accent-neon)" />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Filters</h3>
          </div>

          {/* Categories Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Categories
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  if (onSelectCategory) onSelectCategory('all');
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  background: activeCategory === 'all' ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                  color: activeCategory === 'all' ? 'var(--accent-neon)' : 'var(--text-muted)',
                  fontWeight: activeCategory === 'all' ? 700 : 500
                }}
              >
                <span>All Products</span>
                <span>{products.length}</span>
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (onSelectCategory) onSelectCategory(cat.id);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    background: activeCategory === cat.id ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                    color: activeCategory === cat.id ? 'var(--accent-neon)' : 'var(--text-muted)',
                    fontWeight: activeCategory === cat.id ? 700 : 500
                  }}
                >
                  <span style={{ textAlign: 'left' }}>{cat.name}</span>
                  <span>{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Max Price
              </label>
              <span style={{ color: 'var(--accent-neon)', fontWeight: 700, fontSize: '0.9rem' }}>
                ${priceRange}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-neon)', cursor: 'pointer' }}
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setPriceRange(300);
            }}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-dim)',
              fontSize: '0.82rem'
            }}
          >
            Clear All Filters
          </button>
        </aside>

        {/* Product Results Grid */}
        <div style={{ gridColumn: 'span 3' }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> items
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} color="var(--text-dim)" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  background: '#121620',
                  color: '#fff',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Items */}
          {filteredProducts.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Dumbbell size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Products Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                We couldn't find any products matching your specific filters. Try expanding your search or price range.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setPriceRange(300);
                }}
                className="secondary-btn"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
