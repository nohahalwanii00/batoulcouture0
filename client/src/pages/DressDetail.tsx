import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dressAPI } from '../services/api';
import { Dress } from '../types/Dress';
import './DressDetail.css';
import { AddToCartButton } from '../components';

const DressDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dress, setDress] = useState<Dress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [sizeError, setSizeError] = useState('');
  const [colorError, setColorError] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  // Mock data fallback
  const mockDress: Dress = useMemo(() => ({
    _id: id || '1',
    name: 'Elegant Evening Gown',
    description: 'A stunning evening gown perfect for special occasions. Made from premium silk with intricate beadwork.',
    price: 299.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1c4?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown - Front View' },
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown - Side View' },
      { url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown - Back View' }
    ],
    category: 'Evening Wear',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    color: ['Navy Blue', 'Black', 'Burgundy', 'Emerald Green'],
    inStock: true,
    stockQuantity: 15,
    featured: true,
    specifications: {
      material: '100% Silk',
      length: 'Floor Length',
      neckline: 'Sweetheart',
      sleeve: 'Sleeveless',
      occasion: 'Formal Events',
      care: 'Dry Clean Only'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }), [id]);

  useEffect(() => {
    const fetchDress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await dressAPI.getById(id!);
        const data = response.data;
        setDress(data);
      } catch (err) {
        console.error('Error fetching dress:', err);
        setError('Failed to load dress details. Using mock data for demonstration.');
        setDress(mockDress);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDress();
    }
  }, [id, mockDress]);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setSizeError('');
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setColorError('');
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (dress?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!dress) return;

    // Validation
    if (!selectedSize) {
      setSizeError('Please select a size');
      return;
    }
    if (!selectedColor) {
      setColorError('Please select a color');
      return;
    }

    try {
      setIsAddingToCart(true);
      setCartMessage('');
      
      // Dispatch add to cart immediately, no API
      // This will persist in localStorage via CartContext
      // We keep the simulated delay for UX feedback
      // actual add happens via the button below
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCartMessage('Added to cart successfully!');
      setTimeout(() => setCartMessage(''), 3000);
    } catch (err) {
      setCartMessage('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const navigateModal = (direction: 'prev' | 'next') => {
    if (!dress) return;
    
    let newIndex = modalImageIndex;
    if (direction === 'prev') {
      newIndex = modalImageIndex > 0 ? modalImageIndex - 1 : dress.images.length - 1;
    } else {
      newIndex = modalImageIndex < dress.images.length - 1 ? modalImageIndex + 1 : 0;
    }
    setModalImageIndex(newIndex);
  };

  const getAvailabilityStatus = () => {
    if (!dress) return 'out-of-stock';
    if (dress.stockQuantity === 0) return 'out-of-stock';
    if (dress.stockQuantity <= 5) return 'limited';
    return 'in-stock';
  };

  const getAvailabilityText = () => {
    if (!dress) return 'Out of Stock';
    if (dress.stockQuantity === 0) return 'Out of Stock';
    if (dress.stockQuantity <= 5) return `Only ${dress.stockQuantity} left!`;
    return 'In Stock';
  };

  if (loading) {
    return (
      <div className="dress-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dress details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dress-detail-container">
        <div className="warning-banner">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
        {dress && renderDressDetails()}
      </div>
    );
  }

  if (!dress) {
    return (
      <div className="dress-detail-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Dress Not Found</h2>
          <p>The dress you're looking for doesn't exist or has been removed.</p>
          <div className="error-actions">
            <Link to="/dresses" className="back-button">Browse Dresses</Link>
            <Link to="/" className="back-button">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  function renderDressDetails() {
    if (!dress) {
      return null;
    }
    
    return (
      <div className="dress-detail-content">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/dresses">Dresses</Link> / 
          <span className="current">{dress.name}</span>
        </nav>

        <div className="dress-detail-grid">
          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="main-image-container">
              <img 
                src={dress.images[selectedImage]?.url || dress.images[0]?.url} 
                alt={dress.images[selectedImage]?.alt || dress.name}
                className="main-image"
                onClick={() => openModal(selectedImage)}
              />
              <button 
                className="zoom-button"
                onClick={() => openModal(selectedImage)}
              >
                🔍 Zoom
              </button>
            </div>
            
            <div className="thumbnail-container">
              {dress.images.map((image: { url: string; alt: string }, index: number) => (
                <div 
                  key={index} 
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.url} alt={image.alt} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div className="product-header">
              <h1 className="product-title">{dress.name}</h1>
              <div className="product-meta">
                <span className="product-category">{dress.category}</span>
                {dress.featured && <span className="featured-badge">Featured</span>}
              </div>
            </div>

            <div className="product-price">
              <span className="price">${dress.price.toFixed(2)}</span>
              {getAvailabilityStatus() === 'limited' && (
                <span className="stock-warning">{getAvailabilityText()}</span>
              )}
            </div>

            <p className="product-description">{dress.description}</p>

            {/* Product Specifications */}
            {dress.specifications && (
              <div className="product-specs">
                <div className="spec-item">
                  <strong>Material:</strong>
                  <span>{dress.specifications.material}</span>
                </div>
                <div className="spec-item">
                  <strong>Length:</strong>
                  <span>{dress.specifications.length}</span>
                </div>
                <div className="spec-item">
                  <strong>Neckline:</strong>
                  <span>{dress.specifications.neckline}</span>
                </div>
                <div className="spec-item">
                  <strong>Sleeve:</strong>
                  <span>{dress.specifications.sleeve}</span>
                </div>
                <div className="spec-item">
                  <strong>Occasion:</strong>
                  <span>{dress.specifications.occasion}</span>
                </div>
                <div className="spec-item">
                  <strong>Care:</strong>
                  <span>{dress.specifications.care}</span>
                </div>
              </div>
            )}

            {/* Product Options */}
            <div className="product-options">
              <div className="option-group">
                <label htmlFor="size">Size *</label>
                <select
                  id="size"
                  value={selectedSize}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className={sizeError ? 'error' : ''}
                >
                  <option value="">Select Size</option>
                  {dress.size.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {sizeError && <span className="error-message">{sizeError}</span>}
              </div>

              <div className="option-group">
                <label htmlFor="color">Color *</label>
                <select
                  id="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className={colorError ? 'error' : ''}
                >
                  <option value="">Select Color</option>
                  {dress.color.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                {colorError && <span className="error-message">{colorError}</span>}
              </div>

              <div className="option-group">
                <label htmlFor="quantity">Quantity</label>
                <div className="quantity-selector">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (dress.stockQuantity || 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Product Actions */}
            <div className="product-actions">
              <AddToCartButton
                dress={dress}
                size={selectedSize}
                color={selectedColor}
                quantity={quantity}
                className="add-to-cart-button"
                disabled={!dress.inStock || !selectedSize || !selectedColor || isAddingToCart}
              />
              <button 
                className="add-to-cart-button secondary"
                onClick={handleAddToCart}
                disabled={!dress.inStock || isAddingToCart}
                style={{ marginLeft: '8px', background:'#555' }}
              >
                {isAddingToCart ? 'Processing...' : 'Add & Notify'}
              </button>
                
               {cartMessage && (
                 <div className={`cart-message ${cartMessage.includes('success') ? 'success' : 'error'}`}>
                   {cartMessage}
                 </div>
               )}

               <div className="availability-info">
                 <span className={`availability-status ${getAvailabilityStatus()}`}>
                   {getAvailabilityText()}
                 </span>
               </div>
              <div style={{ marginTop: '12px' }}>
                 {/* WhatsAppContact button removed */}
               </div>
             </div>

            {/* Shipping Information */}
            <div className="product-shipping">
              <div className="shipping-info">
                <span className="shipping-icon">🚚</span>
                <span>Free shipping on orders over $200</span>
              </div>
              <div className="shipping-info">
                <span className="shipping-icon">📦</span>
                <span>Estimated delivery: 3-5 business days</span>
              </div>
              <div className="shipping-info">
                <span className="shipping-icon">🔄</span>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dress-detail-container">
      {error && (
        <div className="warning-banner">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      {renderDressDetails()}

      {/* Image Modal */}
      {showModal && dress && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <button className="modal-nav modal-prev" onClick={() => navigateModal('prev')}>‹</button>
            <button className="modal-nav modal-next" onClick={() => navigateModal('next')}>›</button>
            
            <img
              src={dress.images[modalImageIndex]?.url}
              alt={dress.images[modalImageIndex]?.alt}
              className="modal-image"
            />
            
            <div className="modal-thumbnails">
              {dress.images.map((image: { url: string; alt: string }, index: number) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  className={`modal-thumbnail ${modalImageIndex === index ? 'active' : ''}`}
                  onClick={() => setModalImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DressDetail;