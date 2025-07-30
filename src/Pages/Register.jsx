// src/components/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import './register.css'; // Import the CSS file

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  // Handles changes to input fields and updates the form state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic form validation
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

    // If validation passes, clear any existing errors
    setError("");

    // Placeholder for actual registration logic (e.g., API call)
    console.log("Registration attempt:", {
      name: form.name,
      email: form.email,
      // In a real app, you would hash the password before sending it
      // For demonstration, we'll just log it.
      password: form.password
    });

    // You might want to redirect the user after successful registration
    // For example: history.push('/login');
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
        <button type="submit" className="register-button">
          Register
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