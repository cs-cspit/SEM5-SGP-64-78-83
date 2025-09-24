import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/api';
import './login.css';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (token) {
            handleVerification();
        } else {
            setError('Invalid verification link');
            setLoading(false);
        }
    }, [token]);

    const handleVerification = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await verifyEmail(token);
            setSuccess(true);
            setUserInfo(response.user);

            // Auto-redirect to login after 5 seconds
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Email verified successfully! You can now log in.',
                        type: 'success'
                    }
                });
            }, 5000);

        } catch (error) {
            setError(error || 'Email verification failed');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>🔄 Verifying Email</h2>
                        <p>Please wait while we verify your email address...</p>
                    </div>

                    <div className="login-form-container">
                        <div className="loading-verification">
                            <div className="loading-spinner-large"></div>
                            <p>Verifying your email address...</p>
                            <small>This may take a few seconds</small>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success && userInfo) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>✅ Email Verified Successfully!</h2>
                        <p>Welcome to Jay Jalaram Electricals</p>
                    </div>

                    <div className="login-form-container">
                        <div className="success-message">
                            <div className="success-icon">🎉</div>
                            <h3>Welcome {userInfo.name}!</h3>
                            <p>Your email address has been successfully verified.</p>
                            <p>You can now access all features of your account.</p>
                        </div>

                        <div className="verification-details">
                            <h4>Account Information:</h4>
                            <ul>
                                <li>📧 <strong>Email:</strong> {userInfo.email}</li>
                                <li>👤 <strong>Name:</strong> {userInfo.name}</li>
                                <li>✅ <strong>Status:</strong> Verified</li>
                            </ul>
                        </div>

                        <div className="next-steps">
                            <h4>What's Next?</h4>
                            <ul>
                                <li>✅ Access your personal dashboard</li>
                                <li>✅ View and manage service requests</li>
                                <li>✅ Track invoices and payments</li>
                                <li>✅ Contact our support team</li>
                            </ul>
                        </div>

                        <div className="form-actions">
                            <Link to="/login" className="btn btn-primary">
                                🚀 Start Using Your Account
                            </Link>
                        </div>

                        <div className="auto-redirect">
                            <p>You will be automatically redirected to login in 5 seconds...</p>
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
                    <h2>❌ Email Verification Failed</h2>
                    <p>There was a problem verifying your email</p>
                </div>

                <div className="login-form-container">
                    <div className="error-message">
                        <div className="error-icon">⚠️</div>
                        <h3>Verification Failed</h3>
                        <p>{error}</p>
                    </div>

                    <div className="troubleshooting">
                        <h4>Common Issues:</h4>
                        <ul>
                            <li><strong>Expired Link:</strong> Verification links expire after 24 hours</li>
                            <li><strong>Already Verified:</strong> Your email might already be verified</li>
                            <li><strong>Invalid Link:</strong> The link might be corrupted or incomplete</li>
                        </ul>
                    </div>

                    <div className="form-actions">
                        <Link to="/resend-verification" className="btn btn-primary">
                            📤 Request New Verification Email
                        </Link>
                        <Link to="/login" className="btn btn-secondary">
                            🔙 Back to Login
                        </Link>
                    </div>

                    <div className="help-section">
                        <h4>Need Help?</h4>
                        <p>If you continue to have issues, please:</p>
                        <ul>
                            <li>Check if you're using the latest verification email</li>
                            <li>Make sure you click the complete link from your email</li>
                            <li>Try copying and pasting the entire URL</li>
                            <li>Contact our support team if problems persist</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;