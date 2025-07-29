import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './servicePageGeneral.css'; // Import general styles

const WiringExcellencePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load
  }, []);

  return (
    <div className="service-page-wrapper">
      <header className="detail-hero">
        <img src="/Images/IMG_1.jpg" alt="Electrician working on high-voltage wires" className="detail-hero-img" />
        <div className="detail-hero-overlay">
          <Link to="/" className="back-button">← Back to Home</Link>
          <h1 className="detail-title">Wiring Excellence</h1>
          <p className="detail-tagline">Dependable, modern wiring—precision installed with digital diagnostics for peak safety.</p>
          <Link to="/contact" className="detail-cta-btn">Get a Quote for Wiring Excellence</Link>
        </div>
      </header>

      <section className="detail-content">
        <div className="content-grid">
          <div className="description-section">
            <h2 className="section-heading">Comprehensive Overview</h2>
            <p className="detail-paragraph">
              Our Wiring Excellence service ensures your electrical systems are not just functional, but also incredibly safe and future-proof. We specialize in precision installations, utilizing the latest digital diagnostic tools to detect even the slightest inefficiencies or potential hazards. From residential remodels to commercial new builds, our certified electricians meticulously plan and execute every wiring project to exceed industry standards.
            </p>
            <p className="detail-paragraph">
              We focus on creating robust, organized, and easily maintainable wiring infrastructures. This includes thorough pre-installation assessments, high-quality cable management, and post-installation validation using advanced testing equipment. Our commitment is to deliver a reliable power backbone for your property, minimizing downtime and maximizing safety for years to come.
            </p>
          </div>

          <div className="features-benefits-section">
            <div className="key-features">
              <h3 className="sub-heading">Key Features</h3>
              <ul>
                <li>Digital Diagnostics for precision fault detection</li>
                <li>High-quality, durable cable installations</li>
                <li>Compliance with latest safety standards (NEC, IEC, local codes)</li>
                <li>Structured wiring for easy maintenance and future upgrades</li>
                <li>Energy-efficient wiring solutions for reduced consumption</li>
              </ul>
            </div>

            <div className="benefits">
              <h3 className="sub-heading">Benefits You Gain</h3>
              <ul>
                <li>Enhanced safety and fire prevention</li>
                <li>Reduced risk of electrical failures and outages</li>
                <li>Optimized power delivery and efficiency</li>
                <li>Long-term reliability and reduced maintenance costs</li>
                <li>Preparedness for smart home/office integrations</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="contact-callout">
          <h3>Ready to Power Up Your Project?</h3>
          <p>Contact us today for a detailed consultation regarding our Wiring Excellence services.</p>
          <Link to="/contact" className="detail-cta-btn">Enquire Now</Link>
        </div>
      </section>
    </div>
  );
};

export default WiringExcellencePage;