import React, { useState } from 'react';
import './Contact.css';


const DESTINATION_PHONE = '+963986583086';

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function buildWhatsAppMessage(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const lines = [
    `New inquiry from ${formData.name || 'N/A'}`,
    `Subject: ${formData.subject || 'N/A'}`,
    `Message: ${formData.message || 'N/A'}`,
    `Email: ${formData.email || 'N/A'}`,
    `Phone: ${formData.phone || 'N/A'}`,
  ];
  return lines.join('\n');
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const phone = normalizePhone(DESTINATION_PHONE);
      const message = encodeURIComponent(buildWhatsAppMessage(formData));
      const url = `https://wa.me/${phone}?text=${message}`;
      window.open(url, '_blank');
      setSubmitMessage('WhatsApp chat opened. Please send your message in the new window.');

      // Reset form after opening WhatsApp
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setSubmitMessage('Failed to open WhatsApp. Please check your device supports WhatsApp links.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>
          We’re here to help with custom orders, appointments, and product inquiries. Reach out and we’ll get back to you.
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Contact Information</h2>

          <div className="info-item">
            <div className="info-icon">📍</div>
            <div className="info-text">
              <h3>Address</h3>
              <p>Tripoli, Lebanon</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📞</div>
            <div className="info-text">
              <h3>Phone</h3>
              <p><a href="tel:+963986583086">+963 986 583 086</a></p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">✉️</div>
            <div className="info-text">
              <h3>Email</h3>
              <p><a href="mailto:info@batoulcouture.com">bmaasrani565@gmail.com</a></p>
            </div>
          </div>

       
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          {submitMessage && (
            <div className="submit-message">{submitMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Opening WhatsApp...' : 'Send Message via WhatsApp'}
            </button>
          </form>
        </div>
      </div>

      {/* Additional Information */}
      <div className="additional-info">
        <div className="info-cards">
          <div className="info-card">
            <h3>🕒 Business Hours</h3>
            <ul>
              <li>Monday - Thursday: By appointment only</li>
              <li>Friday - Sunday: Closed</li>
              <li>Extended hours for special occasions</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🚚 Shipping Information</h3>
            <ul>
              <li>Free shipping on orders over $200</li>
              <li>Express delivery available</li>
              <li>International shipping</li>
              <li>Careful packaging and handling</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>👗 Services</h3>
            <ul>
              <li>Custom design consultations</li>
              <li>Professional fittings</li>
              <li>Alterations and adjustments</li>
              <li>Styling advice</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;