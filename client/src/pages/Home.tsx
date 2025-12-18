import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dressAPI } from '../services/api';
import { Dress } from '../types/Dress';
import './Home.css';

const Home: React.FC = () => {
  const [featuredDresses, setFeaturedDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedDresses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dressAPI.getAll({ limit: 3, featured: true });
        setFeaturedDresses(response.data);
      } catch (err) {
        console.error('Error fetching featured dresses:', err);
        setError('Failed to load featured dresses. Please try again later.');
      
        const mockData: Dress[] = [
          {
            _id: '1',
            name: 'Elegant Evening Gown',
            description: 'Stunning evening gown with delicate beadwork and flowing silk fabric.',
            price: 299,
            category: 'evening',
            size: ['XS', 'S', 'M', 'L', 'XL'],
            color: ['Navy Blue', 'Burgundy', 'Emerald Green'],
            images: [{ url: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1c8?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown', isMain: true }],
            material: '100% Silk with crystal beadwork',
            careInstructions: 'Dry clean only. Handle with care.',
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
            careInstructions: 'Professional cleaning recommended.',
            availability: 'in-stock',
            inStock: true,
            stockQuantity: 3,
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '3',
            name: 'Vintage Inspired Dress',
            description: 'Beautiful vintage-inspired design with modern comfort and style.',
            price: 229,
            category: 'vintage',
            size: ['S', 'M', 'L'],
            color: ['Burgundy', 'Forest Green', 'Navy'],
            images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Vintage Inspired Dress', isMain: true }],
            material: 'Rayon Blend',
            careInstructions: 'Hand wash cold, lay flat to dry.',
            availability: 'limited',
            inStock: true,
            stockQuantity: 4,
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setFeaturedDresses(mockData);
      } finally {
        setLoading(false);
      }
    };
       
    fetchFeaturedDresses();
  }, []);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading featured dresses...</p>
        </div>
      </div>
    );
  }

  if (error && featuredDresses.length === 0) {
    return (
      <div className="home-container">
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
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section split">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title">Batoul Couture</h1>
            <p className="hero-subtitle">Timeless abayas crafted for your elegance.</p>
            <div className="hero-buttons">
              <Link to="/dresses" className="hero-button primary">Explore Collection</Link>
              <Link to="/contact" className="hero-button secondary">Private Appointment</Link>
            </div>
            <div className="hero-meta">
              <span className="meta-item">Custom tailoring</span>
              <span className="meta-dot">•</span>
              <span className="meta-item">Bespoke designs</span>
              <span className="meta-dot">•</span>
              <span className="meta-item">One-on-one styling</span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=800&fit=crop"
              alt="Luxury abaya presentation"
              className="hero-image"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.src = 'https://via.placeholder.com/800x600?text=Batoul+Couture';
              }}
            />
          </div>
        </div>
      </section>

      {/* Featured Dresses */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Abayas</h2>
          {error && (
            <div className="warning-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <div className="dresses-grid">
            {featuredDresses.map((dress) => (
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
                </div>
                <div className="dress-info">
                  <h3 className="dress-name">{dress.name}</h3>
                  <p className="dress-description">{dress.description}</p>
                  <div className="dress-details">
                    <span className="dress-price">${dress.price}</span>
                    <span className="dress-category">{dress.category}</span>
                  </div>
                  <Link to={`/dresses/${dress._id}`} className="view-details-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-container">
            <Link to="/dresses" className="view-all-button">
              View All Dresses
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">About Batoul Couture</h2>
            <p className="about-text">
             Batoul’s Couture is a luxury abaya brand 
             specializing in elegant, handcrafted designs that blend
              tradition with modern touch. We offer customized abaya orders
              tailored to each client’s unique style and preferences,
               ensuring a perfect fit and personal touch.  

For a more exclusive experience,
 we also provide private appointments
 for one-on-one styling and bespoke design consultations. 
 Your elegance, our craft. ✨🖤
            </p>
            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">✨</div>
                <h3>Premium Quality</h3>
                <p>Hand-selected fabrics and meticulous craftsmanship</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🎨</div>
                <h3>Unique Designs</h3>
                <p>Exclusive styles you won't find anywhere else</p>
              </div>
              <div className="feature">
                <div className="feature-icon">💝</div>
                <h3>Perfect Fit</h3>
                <p>Multiple sizes and customization options available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;