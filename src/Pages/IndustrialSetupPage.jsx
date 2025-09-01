import React from 'react';
import { Link } from 'react-router-dom';
import './servicePageGeneral.css';

const IndustrialSetupPage = () => {
  return (
    <div className="service-page-wrapper">
      {/* Hero Section */}
      <section className="detail-hero">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="Industrial electrical setup"
          className="detail-hero-img"
        />
        <div className="detail-hero-overlay">
          <Link to="/" className="back-button"><i className="fas fa-arrow-left"></i> Back to Home</Link>
          <h1 className="detail-title">Industrial Setup</h1>
          <p className="detail-tagline">
            Scalable and robust electrical systems for modern industrial needs
          </p>
          <Link to="/contact" className="detail-cta-btn">Get Started</Link>
        </div>
      </section>

      {/* Content Section */}
      <div className="detail-content">
        <div className="content-grid">
          {/* Main Description */}
          <div className="description-section">
            <h2 className="section-heading">Industrial Electrical Solutions</h2>
            <p className="detail-paragraph">
              Jay Jalaram Electricals specializes in designing and implementing comprehensive electrical solutions for industrial facilities. We understand that modern industry demands reliable, efficient, and scalable electrical systems.
            </p>
            <p className="detail-paragraph">
              Our industrial setup services encompass everything from initial planning to final implementation, ensuring your facility operates at peak efficiency while maintaining the highest safety standards.
            </p>
            <h3 className="sub-heading">Our Industrial Process</h3>
            <p className="detail-paragraph">
              1. Requirement Analysis: We work closely with your team to understand specific industrial needs.
            </p>
            <p className="detail-paragraph">
              2. System Design: Our engineers create detailed plans incorporating the latest industrial standards.
            </p>
            <p className="detail-paragraph">
              3. Implementation: Expert installation of all electrical components and systems.
            </p>
            <p className="detail-paragraph">
              4. Testing & Certification: Rigorous testing ensures everything meets industrial safety standards.
            </p>
          </div>

          {/* Features & Benefits */}
          <div className="features-benefits-section">
            <h3 className="section-heading">Benefits</h3>
            <ul>
              <li>Scalable system design</li>
              <li>Energy efficiency optimization</li>
              <li>Load management solutions</li>
              <li>Power quality monitoring</li>
              <li>Industrial automation support</li>
              <li>Emergency backup systems</li>
              <li>Preventive maintenance plans</li>
              <li>Compliance documentation</li>
              <li>24/7 emergency support</li>
              <li>Future expansion readiness</li>
            </ul>
          </div>
        </div>

        {/* Contact Callout */}
        <div className="contact-callout">
          <h3>Ready to Transform Your Industrial Setup?</h3>
          <p>
            Let's discuss how we can optimize your facility's electrical infrastructure.
          </p>
          <Link to="/contact" className="detail-cta-btn">
            Schedule a Consultation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndustrialSetupPage;
