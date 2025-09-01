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
  const [showPassword, setShowPassword] = useState(false);

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
      // Store user data in localStorage if needed
      if (userData.token) {
        localStorage.setItem('userToken', userData.token);
      }
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-main-title">Welcome to JJE</h1>
          <p className="register-subtitle"></p>
        </div>

        <div className="register-form-container">
          <h2 className="register-form-title">Create Account</h2>
          <p className="register-description">Enter your details to create a new account</p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-input-group">
              <label htmlFor="name" className="register-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="register-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="email" className="register-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="register-input"
                placeholder="user@company.com"
                required
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="password" className="register-label">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="register-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="register-input"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="register-error">{error}</div>}

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login" className="register-link">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;