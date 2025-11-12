import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resendVerificationEmail } from '../services/api';
import './login.css';

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Auto-populate email if stored from login attempt
    useEffect(() => {
        const pendingEmail = localStorage.getItem('pendingVerificationEmail');
        if (pendingEmail) {
            setEmail(pendingEmail);
            // Clear it after using
            localStorage.removeItem('pendingVerificationEmail');
        }
    }, []);

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
            await resendVerificationEmail(email);
            setSuccess(true);
        } catch (error) {
            setError(error || 'Failed to send verification email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>📧 Verification Email Sent</h2>
                        <p>Please check your email</p>
                    </div>

                    <div className="login-form-container">
                        <div className="success-message">
                            <div className="success-icon">✅</div>
                            <h3>Email Sent Successfully!</h3>
                            <p>
                                We've sent a new verification link to <strong>{email}</strong>
                            </p>
                            <p>
                                Please check your email and click on the verification link to activate your account.
                            </p>
                        </div>

                        <div className="verification-info">
                            <h4>Important Information:</h4>
                            <ul>
                                <li>📬 Check your inbox and spam folder</li>
                                <li>⏰ The verification link expires in 24 hours</li>
                                <li>🔗 Use the latest verification email if you received multiple</li>
                                <li>📱 The link works on all devices</li>
                            </ul>
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
                                Send to Different Email
                            </button>
                        </div>

                        <div className="help-section">
                            <h4>Still Not Receiving Emails?</h4>
                            <ul>
                                <li>Check your spam/junk folder</li>
                                <li>Add our email to your contacts</li>
                                <li>Try a different email address</li>
                                <li>Contact support if issues persist</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>📤 Resend Verification Email</h2>
                    <p>Enter your email to receive a new verification link</p>
                </div>

                <div className="login-form-container">
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
                                placeholder="Enter your email address"
                                disabled={loading}
                                className="login-input"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Sending Email...
                                </>
                            ) : (
                                <>
                                    📤 Send Verification Email
                                </>
                            )}
                        </button>
                    </form>

                    <div className="form-footer">
                        <p>
                            Already verified? <Link to="/login">Sign In</Link>
                        </p>
                        <p>
                            Need a new account? <Link to="/register">Sign Up</Link>
                        </p>
                    </div>

                    <div className="info-section">
                        <h4>Why Verify Your Email?</h4>
                        <ul>
                            <li>🔒 <strong>Security:</strong> Protect your account from unauthorized access</li>
                            <li>📧 <strong>Communication:</strong> Receive important updates and notifications</li>
                            <li>🔧 <strong>Support:</strong> Get help when you need it</li>
                            <li>💼 <strong>Services:</strong> Access all features of your account</li>
                        </ul>
                    </div>

                    <div className="help-section">
                        <h4>Troubleshooting:</h4>
                        <ul>
                            <li>Make sure you enter the correct email address</li>
                            <li>Check both inbox and spam folders</li>
                            <li>Wait a few minutes for the email to arrive</li>
                            <li>Use the most recent verification email</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResendVerification;