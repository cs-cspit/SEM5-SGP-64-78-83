// src/pages/Home.jsx

import React from 'react';
import './home.css'; // Use the full Apple-inspired and animated UI CSS

const Home = () => (
  <div className="home-wrapper">

    {/* Hero Section with Electrical Background */}
    <section className="hero-section apple-hero">
      <img
        src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80"
        alt="Modern electrical cables cityscape"
        className="hero-bg-img"
      />
      <div className="hero-overlay">
        <h2 className="fade-down">Jay Jalaram Electricals</h2>
        <p className="hero-tagline fade-in">We provide Quality Service</p>
        <div className="hero-buttons slide-up">
          <a href="/contact" className="btn big-btn">Get a Quote</a>
          <a href="#services" className="btn-secondary big-btn">Our Services</a>
        </div>
      </div>
    </section>

    {/* Services with Electrical-Themed Cards */}
    <section className="pro-section" id="services">
      <h3 className="section-title fade-in">Our Signature Services</h3>
      <div className="service-showcase-grid">
        <div className="pro-card fade-left">
          <img
            src="/Images/IMG_1.jpg"
            alt="Electrician working on high-voltage wires"
          />
          <div>
            <h4>Wiring Excellence</h4>
            <p>Dependable, modern wiring—precision installed with digital diagnostics for peak safety.</p>
          </div>
        </div>
        <div className="pro-card fade-up">
          <img
            src="/Images/IMG_2.jpg"
            alt="Technician testing electrical panel"
          />
          <div>
            <h4>Proactive Maintenance</h4>
            <p>Preventive checks, smart analysis, and expert fixes to keep your power uninterrupted.</p>
          </div>
        </div>
        <div className="pro-card fade-down">
          <img
            src="/Images/IMG_3.jpg"
            alt="Modern electrical installation"
          />
          <div>
            <h4>Havells Service Center</h4>
            <p>Complete solutions for homes, offices, and industry—energy efficient and future-ready.</p>
          </div>
        </div>
        <div className="pro-card fade-right">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Industrial electrical setup"
          />
          <div>
            <h4>Industrial Setup</h4>
            <p>Design and commissioning of scalable, robust systems for modern industry demands.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonial Section with Professional Imagery */}
    <section className="testimonial-apple">
      <h3 className="section-title fade-in">Trusted by Industry Leaders</h3>
      <div className="testimonial-carousel fade-up">
        <div className="testimonial-panel">
          <img
            src="https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=facearea&w=400&q=80&facepad=2"
            alt="Client testimonial - male industrial manager"
            className="testimonial-avatar"
          />
          <div>
            <p className="testimonial-text">
              “Precision, safety, and rapid response. Jay Jalaram Electricals raised our standards for reliability.”
            </p>
            <div className="testimonial-name">- Environ Control PVT LTD</div>
          </div>
        </div>
        <div className="testimonial-panel">
          <img
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&w=400&q=80"
            alt="Client testimonial - female office admin"
            className="testimonial-avatar"
          />
          <div>
            <p className="testimonial-text">
              “We loved their professionalism. From wiring to maintenance, everything is flawless and high-tech.”
            </p>
            <div className="testimonial-name">- N. Patel, Business Owner</div>
          </div>
        </div>
      </div>
    </section>

    {/* Contact Call-to-Action */}
    <section className="contact-teaser fade-in">
      <h3 className="section-title">Ready to Go Further?</h3>
      <p className="contact-description">
        Let's build the future of electrical safety and efficiency together. Contact us for a consultation or request a callback below.
      </p>
      <form className="contact-form-apple">
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Email Address" required />
        <textarea name="message" placeholder="How can we help you?" required />
        <button type="submit" className="btn big-btn">Send Message</button>
      </form>
    </section>

  </div>
);

export default Home;