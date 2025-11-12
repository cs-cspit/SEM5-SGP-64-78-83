// src/components/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from '../services/api';
import { FormValidator, APIErrorHandler, PasswordStrengthChecker } from '../utils/errorHandler';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");

  // Handles changes to input fields and updates the form state
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
    
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError("");
    }

    // Update password strength when password changes
    if (name === 'password') {
      const strength = PasswordStrengthChecker.checkStrength(value);
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    const validator = new FormValidator();
    
    // Validate name
    validator.validateName(form.name, 'name');
    
    // Validate email
    validator.validateEmail(form.email, 'email');
    
    // Validate password
    validator.validatePassword(form.password, 'password');
    
    // Validate password confirmation
    validator.validatePasswordConfirmation(form.password, form.confirmPassword);

    // Set field-specific errors
    const fieldErrors = {};
    Object.keys(validator.errors).forEach(field => {
      fieldErrors[field] = validator.getFieldErrors(field)[0]; // Get first error for each field
    });
    
    setErrors(fieldErrors);
    return !validator.hasErrors();
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setGeneralError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const userData = await register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      console.log('Registration successful:', userData);
      
      // Show success modal instead of immediately redirecting
      setRegistrationEmail(form.email);
      setShowSuccessModal(true);
      setGeneralError("");
      
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = APIErrorHandler.parseError(err);
      
      // Handle specific registration errors
      if (errorMessage.includes('email') && errorMessage.includes('exists')) {
        setErrors(prev => ({ ...prev, email: 'An account with this email already exists. Please use a different email or try logging in.' }));
      } else if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else if (errorMessage.includes('password')) {
        setErrors(prev => ({ ...prev, password: 'Password does not meet requirements' }));
      } else if (errorMessage.includes('name')) {
        setErrors(prev => ({ ...prev, name: 'Please enter a valid name' }));
      } else {
        setGeneralError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Compact Success Modal for Email Verification */}
      {showSuccessModal && (
        <div className="verification-modal-overlay" onClick={(e) => {
          if (e.target.className === 'verification-modal-overlay') {
            setShowSuccessModal(false);
            navigate('/login', { 
              state: { 
                message: 'Please verify your email before logging in. Check your inbox!' 
              } 
            });
          }
        }}>
          <div className="verification-modal">
            <button 
              className="modal-close-btn"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/login', { 
                  state: { 
                    message: 'Please verify your email before logging in. Check your inbox!' 
                  } 
                });
              }}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-icon-circle">
              <i className="fas fa-envelope"></i>
            </div>
            
            <h3 className="modal-title">Verify Your Email</h3>
            
            <p className="modal-text">
              We've sent a verification link to
            </p>
            
            <div className="modal-email-box">
              <i className="fas fa-at"></i>
              <span>{registrationEmail}</span>
            </div>
            
            <p className="modal-instruction">
              Click the link in your email to activate your account
            </p>
            
            <div className="modal-buttons">
              <button 
                className="modal-btn-primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/login', { 
                    state: { 
                      message: 'Please verify your email before logging in. Check your inbox!' 
                    } 
                  });
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                Go to Login
              </button>
              <button 
                className="modal-btn-secondary"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/resend-verification');
                }}
              >
                <i className="fas fa-redo"></i>
                Resend Email
              </button>
            </div>
            
            <div className="modal-footer-note">
              <i className="fas fa-clock"></i>
              <span>Link expires in 24 hours</span>
            </div>
          </div>
        </div>
      )}

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
                className={`register-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="register-input-group">
              <label htmlFor="email" className="register-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`register-input ${errors.email ? 'error' : ''}`}
                placeholder="user@company.com"
                required
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
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
                  className={`register-input ${errors.password ? 'error' : ''}`}
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
              {errors.password && <div className="field-error">{errors.password}</div>}
              {passwordStrength && form.password && (
                <div className={`password-strength ${passwordStrength.strength.toLowerCase().replace(' ', '-')}`}>
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: `${(passwordStrength.score / 5) * 100}%` }}></div>
                  </div>
                  <span className="strength-text">Password strength: {passwordStrength.strength}</span>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="strength-feedback">
                      {passwordStrength.feedback.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="register-input-group">
              <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`register-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
              {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
            </div>

            {generalError && <div className="register-error">{generalError}</div>}

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