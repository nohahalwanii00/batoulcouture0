import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="hero">
        <div className="container">
          <h1 className="brand-title">Batoul’s Couture</h1>
          <p className="brand-subtitle">Your elegance, our craft ✨🖤</p>
        </div>
      </section>

      <section className="about-content-section">
        <div className="container">
          <p className="brand-description">
            <strong>Batoul’s Couture</strong> is a luxury abaya brand specializing in elegant, handcrafted designs that blend tradition with modern touch.
            We offer <strong>customized abaya orders</strong> tailored to each client’s unique style and preferences, ensuring a perfect fit and personal touch.
          </p>
          <p className="brand-description">
            For a more exclusive experience, we also provide <strong>private appointments</strong> for one-on-one styling and bespoke design consultations.
          </p>
          <div className="features">
            <div className="feature-card">
              <div className="icon">🧵</div>
              <h3>Handcrafted Elegance</h3>
              <p>Every abaya is made with care, precision, and attention to detail.</p>
            </div>
            <div className="feature-card">
              <div className="icon">🎨</div>
              <h3>Customization</h3>
              <p>From fabric selection to embellishments, we tailor every detail to you.</p>
            </div>
            <div className="feature-card">
              <div className="icon">🖤</div>
              <h3>Private Appointments</h3>
              <p>Enjoy one-on-one styling and bespoke consultation for an exclusive experience.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <Link to="/contact" className="cta-button">Book a Private Appointment</Link>
          <div className="cta-note">For the comfort of our clients, bookings on this page are for women only</div>
        </div>
      </section>
    </div>
  );
};

export default About;
