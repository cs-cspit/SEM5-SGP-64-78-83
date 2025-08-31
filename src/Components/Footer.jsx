import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="modern-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <img src="/Images/logo.png" alt="Jay Jalaram Electricals" className="footer-logo" />
              <h3>Jay Jalaram Electricals</h3>
              <p>Powering Progress, Empowering Industry with innovative electrical solutions and unmatched expertise.</p>
              <div className="footer-social">
                <a href="#" className="social-link">📧</a>
                <a href="#" className="social-link">📱</a>
                <a href="#" className="social-link">🌐</a>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Services</h4>
                <Link to="/services/wiring">Electrical Wiring</Link>
                <Link to="/services/maintenance">Maintenance</Link>
                <Link to="/services/havells">Havells Service</Link>
                <Link to="/services/industrial">Industrial Solutions</Link>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <Link to="/aboutus">About Us</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/clientele">Clientele</Link>
                <Link to="/careers">Careers</Link>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <Link to="/contact">Contact Us</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/terms">Terms & Privacy</Link>
                <Link to="/login">Employee Portal</Link>
              </div>
            </div>
          </div>
          <div className="footer-contact">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>43, Junajin Hanuman Tekri Opp ramji temple rander surat</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉</span>
                <div>
                  <strong>Email</strong>
                  <p>info@jjelectricals.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Jay Jalaram Electricals. All rights reserved.</p>
          <p>Designed & Developed with ⚡ by Jay Jalaram Electricals</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;