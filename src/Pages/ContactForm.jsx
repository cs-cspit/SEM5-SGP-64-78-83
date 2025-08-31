import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context.jsx';
import { submitContactForm } from '../services/api';
import './contact-form.css';

const ContactForm = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [form, setForm] = useState({ 
    name: "", 
    company: "",
    email: "", 
    phone: "", 
    subject: "",
    message: "" 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null && user !== undefined;
  };
  
  // Update form fields
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  
  // Form submission handler with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setError("Please login to submit a contact form.");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (!form.email || !form.message) {
      setError("Email and message are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const response = await submitContactForm(form);
      setSuccess("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", company: "", email: "", phone: "", subject: "", message: "" }); // Reset form
    } catch (err) {
      if (err.includes("Please authenticate")) {
        setError("Your session has expired. Please login again.");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(err.toString());
      }
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill form with user data if available
  React.useEffect(() => {
    if (user && isAuthenticated()) {
      setForm(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Contact Us</h1>
            <p className="hero-subtitle">
              Reach out to us for expert guidance and premium electrical solutions
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main">
        <div className="contact-container">
          <div className="contact-content">
            
            {/* Get in Touch Section */}
            <div className="get-in-touch">
              <h2 className="section-title">Get in touch</h2>
              <p className="section-description">
                Are you ready to take the next step? Get in touch with us today and find out on all of your electrical needs. Whether you're looking for another service provider, electrical installation, maintenance, services, or just have a question about any of our specialized team, we'll be ready to provide the support you need.
              </p>
              
              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-details">
                    <h4>Location</h4>
                    <p>Jay Jalaram Electrical, 43, Junajin Hanuman Tekri Opp ramji temple, Rander, Surat-395005. </p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-details">
                    <h4>Email us</h4>
                    <p>jayjalaram@gmail.com<br/>info@jayjalaram-electric.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <h4>Call us</h4>
                    <p>General Information : +91 79030 89305<br/>
                    Emergency Services : +91 93275 84221<br/>
                    Lighting Solutions : +91 81458 50777<br/>
                    Fan & Home Appliances : +91 99250 84870</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              {!isAuthenticated() && (
                <div className="login-prompt">
                  <div className="login-prompt-content">
                    <h4>🔒 Login Required</h4>
                    <p>Please login to submit a contact form and track your inquiries.</p>
                    <button 
                      type="button" 
                      className="login-prompt-button"
                      onClick={() => navigate('/login')}
                    >
                      Login Now
                    </button>
                  </div>
                </div>
              )}
              
              <h3 className="form-title">Have a question or need assistance?</h3>
              <p className="form-subtitle">Send us a message, and our team will be happy to help!</p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="form-input"
                      required
                      disabled={!isAuthenticated()}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Company"
                      className="form-input"
                      disabled={!isAuthenticated()}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="form-input"
                      disabled={!isAuthenticated()}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="form-input"
                      required
                      disabled={!isAuthenticated()}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <input
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="form-input"
                    disabled={!isAuthenticated()}
                  />
                </div>

                <div className="form-group full-width">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="form-input form-textarea"
                    required
                    disabled={!isAuthenticated()}
                  ></textarea>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={loading || !isAuthenticated()}
                >
                  {loading ? 'Sending...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.54586572747!2d72.73988506031004!3d21.159180203945482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d5778fd2de1%3A0x22037e438b45359!2sHanuman%20Temple!5e0!3m2!1sen!2sin!4v1756658375660!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jay Jalaram Electrical Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="social-section">
          <h3 className="social-title">Follow our social media</h3>
          <div className="social-icons">
            <a href="#" className="social-icon facebook" aria-label="Facebook">
              <span>f</span>
            </a>
            <a href="#" className="social-icon google" aria-label="Google">
              <span>G</span>
            </a>
            <a href="#" className="social-icon linkedin" aria-label="LinkedIn">
              <span>in</span>
            </a>
            <a href="#" className="social-icon youtube" aria-label="YouTube">
              <span>▶</span>
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <div className="bottom-cta">
          <div className="cta-content">
            <h3>Contact us today to discover premium electrical solutions tailored to your needs!</h3>
            <button className="cta-button">CONTACT OUR SALES</button>
          </div>
        </div> */}
      </section>
    </div>
  );
};
export default ContactForm;
