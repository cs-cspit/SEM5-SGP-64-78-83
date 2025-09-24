import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import './login.css'; // Reuse login styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate email
        if (!email) {
            setError('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email);
            setSuccess(true);
        } catch (error) {
            setError(error || 'Failed to send password reset email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>📧 Check Your Email</h2>
                        <p>Password reset link sent successfully</p>
                    </div>

                    <div className="success-message">
                        <div className="success-icon">✅</div>
                        <h3>Email Sent!</h3>
                        <p>
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p>
                            Please check your email and click on the reset link to create a new password.
                            The link will expire in 10 minutes for security purposes.
                        </p>
                    </div>

                    <div className="form-actions">
                        <Link to="/login" className="btn btn-primary">
                            Back to Login
                        </Link>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setSuccess(false);
                                setEmail('');
                            }}
                        >
                            Send Another Email
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>Didn't receive the email? Check your spam folder or try again.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>🔐 Forgot Password</h2>
                    <p>Enter your email to receive a password reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            disabled={loading}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Sending Reset Link...
                            </>
                        ) : (
                            <>
                                📤 Send Reset Link
                            </>
                        )}
                    </button>
                </form>

                <div className="form-footer">
                    <p>
                        Remember your password? <Link to="/login">Back to Login</Link>
                    </p>
                    <p>
                        Don't have an account? <Link to="/register">Sign up here</Link>
                    </p>
                </div>

                <div className="help-section">
                    <h4>Need help?</h4>
                    <ul>
                        <li>Make sure you enter the email address associated with your account</li>
                        <li>Check your spam/junk folder if you don't see the email</li>
                        <li>The reset link will expire in 10 minutes for security</li>
                        <li>Contact support if you continue to have issues</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;