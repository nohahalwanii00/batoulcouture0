import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import CartIcon from './CartIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine admin status (token presence implies admin)
  const isAdmin = !!localStorage.getItem('auth_token');

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Batoul's Couture</h1>
            <span className="tagline">Elegant Abayas</span>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/dresses" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Collection
            </Link>
            <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            {isAdmin ? (
              <Link to="/dashboard" className="nav-link admin-link" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            ) : (
              <Link to="/login" className="nav-link admin-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CartIcon />
          </div>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;