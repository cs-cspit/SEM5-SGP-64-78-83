import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../context/auth-context.jsx';
import { FormValidator, APIErrorHandler } from '../utils/errorHandler';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
    
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const validator = new FormValidator();
    
    // Validate email
    validator.validateEmail(form.email, 'email');
    
    // Validate password
    if (!form.password) {
      validator.addError('password', 'Password is required');
    } else if (form.password.length < 6) {
      validator.addError('password', 'Password must be at least 6 characters long');
    }

    // Set field-specific errors
    const fieldErrors = {};
    Object.keys(validator.errors).forEach(field => {
      fieldErrors[field] = validator.getFieldErrors(field)[0]; // Get first error for each field
    });
    
    setErrors(fieldErrors);
    return !validator.hasErrors();
  };

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
      console.log('Attempting login with email:', form.email);
      const userData = await apiLogin(form);
      console.log('Login successful:', userData);

      if (!userData || !userData.token) {
        throw new Error('Invalid response from server');
      }

      login(userData); // Store user data in context

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = APIErrorHandler.parseError(err);
      
      // Handle specific login errors
      if (errorMessage.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'No account found with this email address' }));
      } else if (errorMessage.includes('password')) {
        setErrors(prev => ({ ...prev, password: 'Incorrect password. Please try again' }));
      } else if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
        setGeneralError('Please verify your email address before logging in. Check your email for verification link.');
        // Store email for resend verification link
        localStorage.setItem('pendingVerificationEmail', form.email);
      } else if (errorMessage.includes('session') || errorMessage.includes('expired')) {
        setGeneralError('Your session has expired. Please try logging in again.');
      } else {
        setGeneralError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-main-title">Welcome to JJE</h1>
          <p className="login-subtitle"></p>
        </div>

        <div className="login-form-container">
          <h2 className="login-form-title">Login In</h2>
          <p className="login-description">Enter your credentials to access system</p>

          {/* Success Message Display */}
          {successMessage && (
            <div className="success-banner">
              <i className="fas fa-check-circle"></i>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label htmlFor="email" className="login-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`login-input ${errors.email ? 'error' : ''}`}
                placeholder="admin@company.com"
                required
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="login-input-group">
              <label htmlFor="password" className="login-label">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`login-input ${errors.password ? 'error' : ''}`}
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
            </div>

            {generalError && (
              <div className="login-error">
                {generalError}
                {generalError.includes('verify') && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <Link to="/resend-verification" className="resend-link">
                      <i className="fas fa-paper-plane"></i> Resend Verification Email
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="form-options">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot your password?
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/register" className="login-link">Create Account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;