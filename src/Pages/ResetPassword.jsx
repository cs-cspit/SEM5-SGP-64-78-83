import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { FormValidator, APIErrorHandler, PasswordStrengthChecker } from '../utils/errorHandler';
import './ResetPassword.css'; // Use dedicated reset password styles

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear field-specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear general error when user starts typing
        if (generalError) {
            setGeneralError('');
        }

        // Update password strength when password changes
        if (name === 'password') {
            const strength = PasswordStrengthChecker.checkStrength(value);
            setPasswordStrength(strength);
        }
    };

    const validateForm = () => {
        const validator = new FormValidator();
        
        // Validate password
        validator.validatePassword(formData.password, 'password');
        
        // Validate password confirmation
        validator.validatePasswordConfirmation(formData.password, formData.confirmPassword);

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
        setGeneralError('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await resetPassword(token, formData.password, formData.confirmPassword);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Password reset successful! You can now login with your new password.' 
                    } 
                });
            }, 3000);

        } catch (error) {
            const errorMessage = APIErrorHandler.parseError(error);
            
            if (errorMessage.includes('token') && errorMessage.includes('invalid')) {
                setGeneralError('This password reset link is invalid or has expired. Please request a new password reset.');
            } else if (errorMessage.includes('token') && errorMessage.includes('expired')) {
                setGeneralError('This password reset link has expired. Please request a new password reset.');
            } else if (errorMessage.includes('password') && errorMessage.includes('match')) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else if (errorMessage.includes('password') && errorMessage.includes('weak')) {
                setErrors(prev => ({ ...prev, password: 'Password is too weak. Please choose a stronger password' }));
            } else {
                setGeneralError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="reset-password-header">
                        <h2>Invalid Reset Link</h2>
                        <p>This password reset link is invalid or missing</p>
                    </div>

                    <div className="reset-password-form-container">
                        <div className="reset-invalid-message">
                            <p>This password reset link is invalid or missing.</p>
                        </div>

                        <div className="reset-form-actions">
                            <Link to="/forgot-password" className="reset-btn reset-btn-primary">
                                Request New Reset Link
                            </Link>
                            <Link to="/login" className="reset-btn reset-btn-secondary">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="reset-password-header">
                        <h2>Password Reset Successful</h2>
                        <p>Your password has been updated successfully</p>
                    </div>

                    <div className="reset-password-form-container">
                        <div className="reset-success-message">
                            <h3>Password Updated!</h3>
                            <p>Your password has been successfully reset.</p>
                            <p>You will be redirected to the login page in 3 seconds...</p>
                        </div>

                        <div className="reset-form-actions">
                            <Link to="/login" className="reset-btn reset-btn-primary">
                                Go to Login Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <h2>Reset Password</h2>
                    <p>Enter your new password</p>
                </div>

                <div className="reset-password-form-container">
                    <form onSubmit={handleSubmit} className="reset-password-form">
                        {generalError && <div className="reset-error-message">{generalError}</div>}

                        <div className="reset-form-group">
                            <label htmlFor="password" className="reset-label">New Password</label>
                            <div className="reset-password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password (min. 6 characters)"
                                    disabled={loading}
                                    autoComplete="new-password"
                                    className={`reset-input ${errors.password ? 'error' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    className="reset-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                </button>
                            </div>
                            {errors.password && <div className="field-error">{errors.password}</div>}
                            {passwordStrength && formData.password && (
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

                        <div className="reset-form-group">
                            <label htmlFor="confirmPassword" className="reset-label">Confirm New Password</label>
                            <div className="reset-password-input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                    disabled={loading}
                                    autoComplete="new-password"
                                    className={`reset-input ${errors.confirmPassword ? 'error' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    className="reset-password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                </button>
                            </div>
                            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
                        </div>

                        <button
                            type="submit"
                            className="reset-btn reset-btn-primary reset-btn-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="reset-loading-spinner"></span>
                                    Updating Password...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </form>

                    <div className="reset-form-footer">
                        <p>
                            <Link to="/login" className="reset-link">Back to Login</Link>
                        </p>
                    </div>

                    <div className="reset-help-section">
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
        </div>
    );
};

export default ResetPassword;