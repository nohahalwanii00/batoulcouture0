import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Batoul's Couture</h3>
            <p>Elegant Abaya for every special occasion. Experience luxury and sophistication with our curated collection.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/dresses">Collection</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📍 lebanon, tripoli</p>
            <p>📞 +963 986 583 086</p>
            <p>✉️ bmaasarani565@gmail.com</p>
          </div>
          
       
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Batoul's Couture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
