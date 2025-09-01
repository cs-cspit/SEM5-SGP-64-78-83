import React from 'react';
import { Link } from 'react-router-dom';
import './servicePageGeneral.css';

const ProactiveMaintenancePage = () => {
  return (
    <div className="service-page-wrapper">
      {/* Hero Section */}
      <section className="detail-hero">
        <img
          src="/Images/IMG_2.jpg"
          alt="Electrical maintenance technician performing inspection"
          className="detail-hero-img"
        />
        <div className="detail-hero-overlay">
          <Link to="/" className="back-button"><i className="fas fa-arrow-left"></i> Back to Home</Link>
          <h1 className="detail-title">Proactive Maintenance</h1>
          <p className="detail-tagline">
            Prevent electrical issues before they happen with our comprehensive maintenance solutions
          </p>
          <Link to="/contact" className="detail-cta-btn">Schedule Maintenance</Link>
        </div>
      </section>

      {/* Content Section */}
      <div className="detail-content">
        <div className="content-grid">
          {/* Main Description */}
          <div className="description-section">
            <h2 className="section-heading">Why Proactive Maintenance?</h2>
            <p className="detail-paragraph">
              At Jay Jalaram Electricals, we believe that prevention is better than cure. Our proactive maintenance service is designed to identify and address potential electrical issues before they develop into costly problems or dangerous situations.
            </p>
            <p className="detail-paragraph">
              Our comprehensive approach combines regular inspections, advanced diagnostics, and preventive repairs to ensure your electrical systems operate at peak efficiency. This not only extends the life of your equipment but also helps prevent unexpected breakdowns and safety hazards.
            </p>
            <h3 className="sub-heading">Our Maintenance Process</h3>
            <p className="detail-paragraph">
              1. Thorough System Inspection: We conduct detailed examinations of your entire electrical system, from circuit breakers to wiring connections.
            </p>
            <p className="detail-paragraph">
              2. Advanced Diagnostics: Using state-of-the-art testing equipment, we identify potential issues that might not be visible during visual inspections.
            </p>
            <p className="detail-paragraph">
              3. Preventive Repairs: We address minor issues before they become major problems, helping you avoid costly emergency repairs.
            </p>
            <p className="detail-paragraph">
              4. Documentation & Reporting: Detailed reports of findings and recommendations help you track your system's health over time.
            </p>
          </div>

          {/* Features & Benefits */}
          <div className="features-benefits-section">
            <h3 className="section-heading">Benefits</h3>
            <ul>
              <li>Reduced risk of electrical failures</li>
              <li>Lower maintenance costs over time</li>
              <li>Extended equipment lifespan</li>
              <li>Improved safety compliance</li>
              <li>Enhanced system efficiency</li>
              <li>24/7 emergency support</li>
              <li>Customized maintenance schedules</li>
              <li>Detailed documentation</li>
              <li>Professional certified technicians</li>
              <li>Latest diagnostic tools</li>
            </ul>
          </div>
        </div>

        {/* Contact Callout */}
        <div className="contact-callout">
          <h3>Ready to Start Your Maintenance Plan?</h3>
          <p>
            Let's work together to keep your electrical systems running safely and efficiently.
          </p>
          <Link to="/contact" className="detail-cta-btn">
            Get Your Custom Maintenance Plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProactiveMaintenancePage;