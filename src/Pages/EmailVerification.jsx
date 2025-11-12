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
                <div className="verification-compact-card">
                    <div className="verification-icon-spinner">
                        <div className="spinner-circle"></div>
                        <i className="fas fa-envelope-open"></i>
                    </div>
                    <h2 className="verification-title">Verifying Email</h2>
                    <p className="verification-text">Please wait while we verify your email address...</p>
                    <div className="verification-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        );
    }

    if (success && userInfo) {
        return (
            <div className="login-container">
                <div className="verification-compact-card success">
                    <div className="verification-icon-circle success">
                        <i className="fas fa-check"></i>
                    </div>
                    <h2 className="verification-title">Email Verified!</h2>
                    <p className="verification-text">Welcome, {userInfo.name}! Your account is now active.</p>
                    
                    <div className="verification-info-box">
                        <div className="info-row">
                            <i className="fas fa-envelope"></i>
                            <span>{userInfo.email}</span>
                        </div>
                        <div className="info-row">
                            <i className="fas fa-check-circle"></i>
                            <span>Account Verified</span>
                        </div>
                    </div>

                    <div className="verification-buttons">
                        <Link to="/login" className="verification-btn-primary">
                            <i className="fas fa-sign-in-alt"></i>
                            Continue to Login
                        </Link>
                    </div>

                    <div className="auto-redirect-notice">
                        <i className="fas fa-clock"></i>
                        <span>Redirecting in 5 seconds...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="verification-compact-card error">
                <div className="verification-icon-circle error">
                    <i className="fas fa-times"></i>
                </div>
                <h2 className="verification-title">Verification Failed</h2>
                <p className="verification-text">{error}</p>
                
                <div className="verification-error-box">
                    <h4><i className="fas fa-info-circle"></i> Common Issues:</h4>
                    <ul>
                        <li>Link expired (valid for 24 hours)</li>
                        <li>Email already verified</li>
                        <li>Invalid or incomplete link</li>
                    </ul>
                </div>

                <div className="verification-buttons">
                    <Link to="/resend-verification" className="verification-btn-primary">
                        <i className="fas fa-redo"></i>
                        Request New Link
                    </Link>
                    <Link to="/login" className="verification-btn-secondary">
                        <i className="fas fa-arrow-left"></i>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;