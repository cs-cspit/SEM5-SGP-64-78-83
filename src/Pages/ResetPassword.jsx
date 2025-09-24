import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import './login.css'; // Reuse login styles

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (!formData.password || !formData.confirmPassword) {
            setError('Both password fields are required');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            await resetPassword(token, formData.password, formData.confirmPassword);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            setError(error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>❌ Invalid Reset Link</h2>
                    </div>

                    <div className="error-message">
                        <p>This password reset link is invalid or missing.</p>
                    </div>

                    <div className="form-actions">
                        <Link to="/forgot-password" className="btn btn-primary">
                            Request New Reset Link
                        </Link>
                        <Link to="/login" className="btn btn-secondary">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>✅ Password Reset Successful</h2>
                    </div>

                    <div className="success-message">
                        <div className="success-icon">🎉</div>
                        <h3>Password Updated!</h3>
                        <p>Your password has been successfully reset.</p>
                        <p>You will be redirected to the login page in 3 seconds...</p>
                    </div>

                    <div className="form-actions">
                        <Link to="/login" className="btn btn-primary">
                            Go to Login Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>🔐 Reset Password</h2>
                    <p>Enter your new password</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password (min. 6 characters)"
                                disabled={loading}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                        <small className="password-hint">
                            Password must be at least 6 characters long
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                                disabled={loading}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex="-1"
                            >
                                {showConfirmPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Updating Password...
                            </>
                        ) : (
                            <>
                                🔓 Update Password
                            </>
                        )}
                    </button>
                </form>

                <div className="form-footer">
                    <p>
                        <Link to="/login">Back to Login</Link>
                    </p>
                </div>

                <div className="help-section">
                    <h4>Password Requirements:</h4>
                    <ul>
                        <li>At least 6 characters long</li>
                        <li>Both password fields must match</li>
                        <li>Choose a strong, unique password</li>
                        <li>Don't reuse old passwords</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;