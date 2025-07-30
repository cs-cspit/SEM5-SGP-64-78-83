import React, { useState } from "react";
import './login.css';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    // Auth logic here
    setError("");
    console.log("Login attempt:", form.email);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        
        <div className="login-input-group">
          <label htmlFor="email" className="login-label">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="login-input"
            required
          />
        </div>

        <div className="login-input-group">
          <label htmlFor="password" className="login-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="login-input"
            required
          />
        </div>

        {error && <div className="login-error">{error}</div>}
        
        <button type="submit" className="login-button">
          Sign In
        </button>

        <div className="login-footer">
          Don't have an account? <a href="/register" className="login-link">Register here</a>
        </div>
      </form>
    </div>
  );
};
export default Login;
