import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../Components/AdminLayout';
import { FormValidator, APIErrorHandler } from '../../utils/errorHandler';
import './AddClient.css';

const AddClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    gstNumber: '',
    email: '',
    phone: '',
    contactPerson: '',
    panNumber: '',
    address: '',
    bankDetails: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-populate form when coming from role change
  useEffect(() => {
    if (location.state?.fromRoleChange) {
      setUserId(location.state.userId);
      setFormData(prev => ({
        ...prev,
        contactPerson: location.state.userName || '',
        email: location.state.userEmail || ''
      }));
    }
  }, [location.state]);

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
  };

  const validateForm = () => {
    const validator = new FormValidator();

    // Validate required fields
    validator.validateRequired(formData.companyName, 'companyName', 'Company name is required');
    validator.validateRequired(formData.gstNumber, 'gstNumber', 'GST number is required');
    validator.validateRequired(formData.email, 'email', 'Email is required');
    validator.validateRequired(formData.phone, 'phone', 'Phone number is required');
    validator.validateRequired(formData.address, 'address', 'Address is required');

    // Validate email format
    if (formData.email) {
      validator.validateEmail(formData.email, 'email');
    }

    // Validate GST number
    if (formData.gstNumber) {
      validator.validateGST(formData.gstNumber, 'gstNumber');
    }

    // Validate PAN number (optional)
    if (formData.panNumber) {
      validator.validatePAN(formData.panNumber, 'panNumber', false);
    }

    // Validate phone number
    if (formData.phone) {
      validator.validatePhone(formData.phone, 'phone');
    }

    // Validate company name length
    if (formData.companyName) {
      validator.validateLength(formData.companyName, 'companyName', 2, 100);
    }

    // Validate contact person name if provided
    if (formData.contactPerson) {
      validator.validateName(formData.contactPerson, 'contactPerson');
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
    setGeneralError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setGeneralError('You must be logged in to perform this action');
        return;
      }

      // Include userId if converting existing user to client
      const requestData = userId ? { ...formData, userId } : formData;

      const response = await axios.post(
        'http://localhost:5000/api/clients',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Client created successfully:', response.data);

      navigate('/admin/user-roles', {
        state: {
          message: `Client "${formData.companyName}" created successfully!`
        }
      });
    } catch (err) {
      console.error('Error creating client:', err);
      const errorMessage = APIErrorHandler.parseError(err);

      // Handle specific client creation errors
      if (errorMessage.includes('GST') && errorMessage.includes('exists')) {
        setErrors(prev => ({ ...prev, gstNumber: 'A client with this GST number already exists' }));
      } else if (errorMessage.includes('email') && errorMessage.includes('exists')) {
        setErrors(prev => ({ ...prev, email: 'A client with this email already exists' }));
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('authenticate')) {
        setGeneralError('You are not authorized to perform this action. Please login again.');
      } else if (errorMessage.includes('validation')) {
        setGeneralError('Please check your input data and try again.');
      } else {
        setGeneralError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/user-roles');
  };

  return (
    <AdminLayout>
      <div className="add-client-page">
        <div className="page-header">
          <div className="header-content">
            <button className="back-button" onClick={handleCancel}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="header-text">
              <h1>{location.state?.fromRoleChange ? 'Convert User to Client' : 'Add New Client'}</h1>
              <p>{location.state?.fromRoleChange ? 'Complete client information to convert user to client' : 'Create a new client profile'}</p>
            </div>
          </div>
        </div>

        <div className="form-container">
          <div className="form-card">
            <div className="form-section">
              <h2>Client Information</h2>

              <form onSubmit={handleSubmit} className="add-client-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="companyName">Company Name *</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`form-input ${errors.companyName ? 'error' : ''}`}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && <div className="field-error">{errors.companyName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="gstNumber">GST Number *</label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className={`form-input ${errors.gstNumber ? 'error' : ''}`}
                      placeholder="29ABCDE1234F1Z5"
                    />
                    {errors.gstNumber && <div className="field-error">{errors.gstNumber}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="contact@company.com"
                    />
                    {errors.email && <div className="field-error">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && <div className="field-error">{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactPerson">Contact Person</label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className={`form-input ${errors.contactPerson ? 'error' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.contactPerson && <div className="field-error">{errors.contactPerson}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="panNumber">PAN Number</label>
                    <input
                      type="text"
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      className={`form-input ${errors.panNumber ? 'error' : ''}`}
                      placeholder="ABCDE1234F"
                    />
                    {errors.panNumber && <div className="field-error">{errors.panNumber}</div>}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-input ${errors.address ? 'error' : ''}`}
                    placeholder="Enter complete address"
                    rows="3"
                  ></textarea>
                  {errors.address && <div className="field-error">{errors.address}</div>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="bankDetails">Bank Details</label>
                  <textarea
                    id="bankDetails"
                    name="bankDetails"
                    value={formData.bankDetails}
                    onChange={handleChange}
                    className={`form-input ${errors.bankDetails ? 'error' : ''}`}
                    placeholder="Bank name, account number, IFSC code"
                    rows="3"
                  ></textarea>
                  {errors.bankDetails && <div className="field-error">{errors.bankDetails}</div>}
                </div>

                {generalError && <div className="error-message">{generalError}</div>}

                <div className="form-actions">
                  <button type="button" onClick={handleCancel} className="cancel-button">
                    Cancel
                  </button>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddClient;
