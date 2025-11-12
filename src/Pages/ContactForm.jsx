import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context.jsx';
import { submitContactForm } from '../services/api';
import { FormValidator, APIErrorHandler } from '../utils/errorHandler';
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
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null && user !== undefined;
  };
  
  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general messages when user starts typing
    if (generalError) {
      setGeneralError("");
    }
    if (success) {
      setSuccess("");
    }
  };

  const validateForm = () => {
    const validator = new FormValidator();
    
    // Validate required fields
    validator.validateRequired(form.name, 'name');
    validator.validateRequired(form.email, 'email');
    validator.validateRequired(form.message, 'message');
    
    // Validate email format
    if (form.email) {
      validator.validateEmail(form.email, 'email');
    }
    
    // Validate phone if provided
    if (form.phone) {
      validator.validatePhone(form.phone, 'phone');
    }
    
    // Validate name format
    if (form.name) {
      validator.validateName(form.name, 'name');
    }
    
    // Validate message length
    if (form.message) {
      validator.validateLength(form.message, 'message', 10, 1000);
    }
    
    // Validate subject length if provided
    if (form.subject) {
      validator.validateLength(form.subject, 'subject', 0, 200);
    }

    // Set field-specific errors
    const fieldErrors = {};
    Object.keys(validator.errors).forEach(field => {
      fieldErrors[field] = validator.getFieldErrors(field)[0]; // Get first error for each field
    });
    
    setErrors(fieldErrors);
    return !validator.hasErrors();
  };
  
  // Form submission handler with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setGeneralError("Please login to submit a contact form.");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    // Clear previous errors
    setErrors({});
    setGeneralError("");
    setSuccess("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await submitContactForm(form);
      setSuccess("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", company: "", email: "", phone: "", subject: "", message: "" }); // Reset form
    } catch (err) {
      console.error('Contact form error:', err);
      const errorMessage = APIErrorHandler.parseError(err);
      
      if (errorMessage.includes("authenticate") || errorMessage.includes("session")) {
        setGeneralError("Your session has expired. Please login again.");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (errorMessage.includes("email")) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else if (errorMessage.includes("message")) {
        setErrors(prev => ({ ...prev, message: 'Please enter a valid message' }));
      } else {
        setGeneralError(errorMessage);
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
      <section className="contact-page-hero">
        <div className="contact-hero-overlay">
          <div className="contact-hero-content">
            <h1 className="contact-hero-title">Contact Us</h1>
            <p className="contact-hero-subtitle">
              Reach out to us for expert guidance and premium electrical solutions
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-page-main">
        <div className="contact-page-container">
          <div className="contact-page-content">
            
            {/* Get in Touch Section */}
            <div className="contact-get-in-touch">
              <h2 className="contact-section-title">Get in touch</h2>
              <p className="contact-section-description">
                Are you ready to take the next step? Get in touch with us today and find out on all of your electrical needs. Whether you're looking for another service provider, electrical installation, maintenance, services, or just have a question about any of our specialized team, we'll be ready to provide the support you need.
              </p>
              
              {/* Contact Info */}
              <div className="contact-page-info">
                <div className="contact-page-item">
                  <div className="contact-page-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="contact-page-details">
                    <h4>Location</h4>
                    <p>Jay Jalaram Electricals || 43, Junajin Hanuman Tekri Opp ramji temple, Rander, Surat-395005. </p>
                  </div>
                </div>
                
                <div className="contact-page-item">
                  <div className="contact-page-icon"><i className="fas fa-envelope"></i></div>
                  <div className="contact-page-details">
                    <h4>Email us</h4>
                    <p>jayjalaramelectricals@gmail.com<br/>kevinsailor.jje@gmail.com</p>
                  </div>
                </div>
                
                <div className="contact-page-item">
                  <div className="contact-page-icon"><i className="fas fa-phone"></i></div>
                  <div className="contact-page-details">
                    <h4>Call us</h4>
                   
                    <p>Emergency Services : +91 70163 88853<br/>
                    General Information : +91 95867 59411<br/>
                    Havells Solutions : +91 95587 06034<br/>
                    Fan & Home Appliances : +91 968796 09411</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              {!isAuthenticated() && (
                <div className="contact-login-prompt">
                  <div className="contact-login-prompt-content">
                    <h4><i className="fas fa-lock"></i> Login Required</h4>
                    <p>Please login to submit a contact form and track your inquiries.</p>
                    <button 
                      type="button" 
                      className="contact-login-prompt-button"
                      onClick={() => navigate('/login')}
                    >
                      Login Now
                    </button>
                  </div>
                </div>
              )}
              
              <h3 className="contact-form-title">Have a question or need assistance?</h3>
              <p className="contact-form-subtitle">Send us a message, and our team will be happy to help!</p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name *"
                      className={`contact-form-input ${errors.name ? 'error' : ''}`}
                      required
                      disabled={!isAuthenticated()}
                    />
                    {errors.name && <div className="contact-field-error">{errors.name}</div>}
                  </div>
                  <div className="contact-form-group">
                    <input
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Company"
                      className="contact-form-input"
                      disabled={!isAuthenticated()}
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className={`contact-form-input ${errors.phone ? 'error' : ''}`}
                      disabled={!isAuthenticated()}
                    />
                    {errors.phone && <div className="contact-field-error">{errors.phone}</div>}
                  </div>
                  <div className="contact-form-group">
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email *"
                      className={`contact-form-input ${errors.email ? 'error' : ''}`}
                      required
                      disabled={!isAuthenticated()}
                    />
                    {errors.email && <div className="contact-field-error">{errors.email}</div>}
                  </div>
                </div>

                <div className="contact-form-group contact-full-width">
                  <input
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className={`contact-form-input ${errors.subject ? 'error' : ''}`}
                    disabled={!isAuthenticated()}
                  />
                  {errors.subject && <div className="contact-field-error">{errors.subject}</div>}
                </div>

                <div className="contact-form-group contact-full-width">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here... *"
                    className={`contact-form-input contact-form-textarea ${errors.message ? 'error' : ''}`}
                    required
                    disabled={!isAuthenticated()}
                  ></textarea>
                  {errors.message && <div className="contact-field-error">{errors.message}</div>}
                </div>

                {generalError && <div className="contact-error-message">{generalError}</div>}
                {success && <div className="contact-success-message">{success}</div>}
                
                <button 
                  type="submit" 
                  className="contact-submit-button" 
                  disabled={loading || !isAuthenticated()}
                >
                  {loading ? 'Sending...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="contact-map-section">
            <div className="contact-map-container">
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
        <div className="contact-social-section">
          <h3 className="contact-social-title">Follow our social media</h3>
          <div className="contact-social-icons">
            <a href="#" className="contact-social-icon facebook" aria-label="Facebook">
              <span>f</span>
            </a>
            <a href="#" className="contact-social-icon google" aria-label="Google">
              <span>G</span>
            </a>
            <a href="#" className="contact-social-icon linkedin" aria-label="LinkedIn">
              <span>in</span>
            </a>
            <a href="#" className="contact-social-icon youtube" aria-label="YouTube">
              <span><i className="fab fa-youtube"></i></span>
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <div className="contact-bottom-cta">
          <div className="contact-cta-content">
            <h3>Contact us today to discover premium electrical solutions tailored to your needs!</h3>
            <button className="contact-cta-button">CONTACT OUR SALES</button>
          </div>
        </div> */}
      </section>
    </div>
  );
};
export default ContactForm;
