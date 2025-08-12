// src/components/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from '../services/api';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles changes to input fields and updates the form state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userData = await register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      console.log('Registration successful:', userData);
      navigate('/'); // Redirect to home page after successful registration
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Create Account</h2>

        {/* Name Input */}
        <div className="register-input-group">
          <label htmlFor="name" className="register-label">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>

        {/* Email Input */}
        <div className="register-input-group">
          <label htmlFor="email" className="register-label">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>

        {/* Password Input */}
        <div className="register-input-group">
          <label htmlFor="password" className="register-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="register-input-group">
          <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>

        {/* Error Message Display */}
        {error && <div className="register-error">{error}</div>}

        {/* Submit Button */}
        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Footer with Login Link */}
        <div className="register-footer">
          Already have an account? <Link to="/login" className="register-link">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;