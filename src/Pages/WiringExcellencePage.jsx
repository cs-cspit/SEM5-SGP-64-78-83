import React from 'react';
import { Link } from 'react-router-dom';
import './servicePageGeneral.css';

const WiringExcellencePage = () => {
  return (
    <div className="service-page-wrapper">
      {/* Hero Section */}
      <section className="detail-hero">
        <img
          src="/Images/IMG_1.jpg"
          alt="Electrician working on high-voltage wires"
          className="detail-hero-img"
        />
        <div className="detail-hero-overlay">
          <Link to="/" className="back-button"><i className="fas fa-arrow-left"></i> Back to Home</Link>
          <h1 className="detail-title">Wiring Excellence</h1>
          <p className="detail-tagline">
            Precision wiring solutions with advanced digital diagnostics for optimal safety
          </p>
          <Link to="/contact" className="detail-cta-btn">Request Service</Link>
        </div>
      </section>

      {/* Content Section */}
      <div className="detail-content">
        <div className="content-grid">
          {/* Main Description */}
          <div className="description-section">
            <h2 className="section-heading">Professional Wiring Services</h2>
            <p className="detail-paragraph">
              Jay Jalaram Electricals delivers top-tier wiring solutions that combine precision installation with cutting-edge digital diagnostics. Our expert technicians ensure every connection is perfect, providing you with a safe and efficient electrical system.
            </p>
            <p className="detail-paragraph">
              Whether you need new installations, upgrades, or troubleshooting, our comprehensive wiring services cover all your electrical needs while maintaining the highest safety standards.
            </p>
            <h3 className="sub-heading">Our Wiring Process</h3>
            <p className="detail-paragraph">
              1. Initial Assessment: We thoroughly evaluate your electrical requirements and existing infrastructure.
            </p>
            <p className="detail-paragraph">
              2. Digital Planning: Using advanced software, we create detailed wiring diagrams and load calculations.
            </p>
            <p className="detail-paragraph">
              3. Professional Installation: Our certified technicians execute the plan with precision and attention to detail.
            </p>
            <p className="detail-paragraph">
              4. Safety Testing: Comprehensive testing using digital diagnostics ensures everything meets safety standards.
            </p>
          </div>

          {/* Features & Benefits */}
          <div className="features-benefits-section">
            <h3 className="section-heading">Benefits</h3>
            <ul>
              <li>Professional grade materials</li>
              <li>Digital diagnostic testing</li>
              <li>Safety compliance guaranteed</li>
              <li>Energy-efficient solutions</li>
              <li>Future-ready installations</li>
              <li>Extended warranty coverage</li>
              <li>24/7 emergency support</li>
              <li>Certified technicians</li>
              <li>Detailed documentation</li>
              <li>Cost-effective solutions</li>
            </ul>
          </div>
        </div>

        {/* Contact Callout */}
        <div className="contact-callout">
          <h3>Ready to Upgrade Your Electrical System?</h3>
          <p>
            Let us help you create a safer, more efficient electrical infrastructure.
          </p>
          <Link to="/contact" className="detail-cta-btn">
            Get Your Free Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WiringExcellencePage;
