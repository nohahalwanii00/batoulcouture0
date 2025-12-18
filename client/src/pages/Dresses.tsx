import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dressAPI } from '../services/api';
import { Dress } from '../types/Dress';
import './Dresses.css';
import { AddToCartButton } from '../components';

const Dresses: React.FC = () => {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['all', 'evening', 'wedding', 'cocktail', 'vintage', 'casual'];
  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'newest', label: 'Newest First' }
  ];

  useEffect(() => {
    const fetchDresses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dressAPI.getAll();
        setDresses(response.data);
      } catch (err) {
        console.error('Error fetching dresses:', err);
        setError('Failed to load dresses. Please try again later.');
        // Fallback to mock data if API fails
        const mockData: Dress[] = [
          {
            _id: '1',
            name: 'Elegant Evening Gown',
            description: 'Stunning evening gown with delicate beadwork and flowing silk fabric. Perfect for galas and formal dinners.',
            price: 299,
            category: 'evening',
            size: ['XS', 'S', 'M', 'L', 'XL'],
            color: ['Navy Blue', 'Burgundy', 'Emerald Green'],
            images: [{ url: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1c8?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown', isMain: true }],
            material: '100% Silk with crystal beadwork',
            careInstructions: 'Dry clean only. Handle with care. Store on padded hanger to maintain shape.',
            availability: 'in-stock',
            inStock: true,
            stockQuantity: 5,
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Romantic Wedding Dress',
            description: 'Beautiful lace wedding dress with elegant train and intricate detailing.',
            price: 599,
            category: 'wedding',
            size: ['XS', 'S', 'M', 'L'],
            color: ['Ivory', 'White', 'Champagne'],
            images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop', alt: 'Romantic Wedding Dress', isMain: true }],
            material: 'Lace and Tulle with pearl accents',
            careInstructions: 'Professional cleaning recommended. Store in breathable garment bag.',
            availability: 'in-stock',
            inStock: true,
            stockQuantity: 3,
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '3',
            name: 'Chic Cocktail Dress',
            description: 'Perfect for special occasions and evening events.',
            price: 199,
            category: 'cocktail',
            size: ['S', 'M', 'L'],
            color: ['Black', 'Gold', 'Silver'],
            images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Chic Cocktail Dress', isMain: true }],
            material: 'Polyester Blend with sequin details',
            careInstructions: 'Hand wash cold, hang to dry. Do not iron directly on sequins.',
            availability: 'limited',
            inStock: true,
            stockQuantity: 2,
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '4',
            name: 'Vintage Inspired Dress',
            description: 'Beautiful vintage-inspired design with modern comfort and style.',
            price: 229,
            category: 'vintage',
            size: ['S', 'M', 'L', 'XL'],
            color: ['Burgundy', 'Forest Green', 'Navy'],
            images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Vintage Inspired Dress', isMain: true }],
            material: 'Rayon Blend',
            careInstructions: 'Hand wash cold, lay flat to dry. Do not wring or twist.',
            availability: 'limited',
            inStock: true,
            stockQuantity: 4,
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '5',
            name: 'Casual Summer Dress',
            description: 'Light and comfortable dress perfect for everyday wear.',
            price: 89,
            category: 'casual',
            size: ['XS', 'S', 'M', 'L', 'XL'],
            color: ['White', 'Beige', 'Light Blue'],
            images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', alt: 'Casual Summer Dress', isMain: true }],
            material: 'Cotton Blend',
            careInstructions: 'Machine wash cold, tumble dry low.',
            availability: 'in-stock',
            inStock: true,
            stockQuantity: 8,
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setDresses(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchDresses();
  }, []);

  // Filter, sort, and search logic
  const filteredAndSortedDresses = dresses
    .filter(dress => {
      const matchesCategory = category === 'all' || dress.category === category;
      const searchTermLower = (searchTerm || '').toLowerCase();
      const nameLower = (dress.name || '').toLowerCase();
      const descLower = (dress.description || '').toLowerCase();
      const matchesSearch = nameLower.includes(searchTermLower) || descLower.includes(searchTermLower);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="dresses-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dresses...</p>
        </div>
      </div>
    );
  }

  if (error && filteredAndSortedDresses.length === 0) {
    return (
      <div className="dresses-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dresses-container">
      {/* Header */}
      <div className="dresses-header">
        <div className="container">
          <h1 className="page-title">Our Collection</h1>
          <p className="page-subtitle">Discover our carefully curated selection of elegant dresses</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="container">
          {error && (
            <div className="warning-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search">Search:</label>
              <input
                id="search"
                type="text"
                placeholder="Search dresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="results-info">
            <p>Showing {filteredAndSortedDresses.length} of {dresses.length} dresses</p>
          </div>
        </div>
      </div>

      {/* Dresses Grid */}
      <div className="dresses-grid-section">
        <div className="container">
          {filteredAndSortedDresses.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No dresses found</h3>
              <p>Try adjusting your search criteria or filters.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategory('all');
                  setSortBy('name');
                }} 
                className="clear-filters-button"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="dresses-grid">
              {filteredAndSortedDresses.map((dress) => (
                <div key={dress._id} className="dress-card">
                  <div className="dress-image-container">
                    <img
                      src={dress.images[0]?.url || 'https://via.placeholder.com/400x600?text=No+Image'}
                      alt={dress.images[0]?.alt || dress.name}
                      className="dress-image"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found';
                      }}
                    />
                    {dress.stockQuantity <= 5 && dress.stockQuantity > 0 && (
                      <div className="stock-badge low-stock">Only {dress.stockQuantity} left!</div>
                    )}
                    {dress.availability === 'limited' && (
                      <div className="stock-badge limited">Limited Edition</div>
                    )}
                    {dress.featured && (
                      <div className="featured-badge">Featured</div>
                    )}
                  </div>
                  <div className="dress-info">
                    <h3 className="dress-name">{dress.name}</h3>
                    <p className="dress-description">{dress.description}</p>
                    <div className="dress-details">
                      <span className="dress-price">${dress.price}</span>
                      <span className="dress-category">{dress.category}</span>
                    </div>
                    <div className="dress-meta">
                      <span className="dress-sizes">Sizes: {dress.size.join(', ')}</span>
                      <span className="dress-colors">Colors: {dress.color.slice(0, 3).join(', ')}</span>
                    </div>
                    <Link to={`/dresses/${dress._id}`} className="view-details-button">
                      View Details
                    </Link>
                    <div style={{ marginTop: '8px' }}>
                      <AddToCartButton 
                        dress={dress}
                        className="small-add-to-cart"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dresses;