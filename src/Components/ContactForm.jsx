import React, { useState } from "react";
import './contact-form.css';

const ContactForm = () => {
  // Form state management
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState("");
  
  // Update form fields
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  
  // Form submission handler with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.message) {
      setError("Email and message are required.");
      return;
    }
    setError("");
    console.log("Form submitted:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2 className="login-title">Contact Us</h2>
      <div className="form-group">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">Message *</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          className="form-input form-textarea"
          required
        ></textarea>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" className="submit-button">
        Send Message
      </button>
    </form>
  );
};
export default ContactForm;
