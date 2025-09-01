import React from 'react';
import { Link } from 'react-router-dom';
import './servicePageGeneral.css';

const HavellsServiceCenterPage = () => {
  return (
    <div className="service-page-wrapper">
      {/* Hero Section */}
      <section className="detail-hero">
        <img
          src="/Images/IMG_3.jpg"
          alt="Modern electrical installation"
          className="detail-hero-img"
        />
        <div className="detail-hero-overlay">
          <Link to="/" className="back-button"><i className="fas fa-arrow-left"></i> Back to Home</Link>
          <h1 className="detail-title">Havells Service Center</h1>
          <p className="detail-tagline">
            Authorized service center for all your Havells product needs
          </p>
          <Link to="/contact" className="detail-cta-btn">Book Service</Link>
        </div>
      </section>

      {/* Content Section */}
      <div className="detail-content">
        <div className="content-grid">
          {/* Main Description */}
          <div className="description-section">
            <h2 className="section-heading">Authorized Havells Service</h2>
            <p className="detail-paragraph">
              As an authorized Havells service center, we provide comprehensive solutions for all Havells products. Our team of certified technicians ensures that your Havells equipment operates at peak efficiency while maintaining manufacturer standards.
            </p>
            <p className="detail-paragraph">
              From installation to maintenance and repairs, we handle everything with professional expertise and genuine Havells parts to ensure lasting quality and reliability.
            </p>
            <h3 className="sub-heading">Our Service Process</h3>
            <p className="detail-paragraph">
              1. Diagnostic Assessment: Thorough evaluation of your Havells products.
            </p>
            <p className="detail-paragraph">
              2. Expert Solutions: Professional repair and maintenance using genuine parts.
            </p>
            <p className="detail-paragraph">
              3. Quality Testing: Comprehensive testing to ensure optimal performance.
            </p>
            <p className="detail-paragraph">
              4. Warranty Service: Complete warranty support and documentation.
            </p>
          </div>

          {/* Features & Benefits */}
          <div className="features-benefits-section">
            <h3 className="section-heading">Benefits</h3>
            <ul>
              <li>Certified Havells technicians</li>
              <li>Genuine Havells parts</li>
              <li>Warranty protection</li>
              <li>Quick turnaround time</li>
              <li>Regular maintenance plans</li>
              <li>Emergency repair service</li>
              <li>Professional installation</li>
              <li>Performance optimization</li>
              <li>Product consultations</li>
              <li>Extended warranty options</li>
            </ul>
          </div>
        </div>

        {/* Contact Callout */}
        <div className="contact-callout">
          <h3>Need Havells Product Service?</h3>
          <p>
            Get professional support from our certified Havells service team.
          </p>
          <Link to="/contact" className="detail-cta-btn">
            Schedule Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HavellsServiceCenterPage;
