import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../Components/AdminLayout';
import './AddClient.css';

const AddClient = () => {
  const navigate = useNavigate();
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.companyName || !formData.gstNumber || !formData.email ||
        !formData.phone || !formData.address) {
      setError('Required fields: Company Name, GST Number, Email, Phone, and Address');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // GST number validation
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
    if (!gstRegex.test(formData.gstNumber)) {
      setError('Please enter a valid GST number (format: 29ABCDE1234F1Z5)');
      return false;
    }

    // PAN number validation (if provided)
    if (formData.panNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.panNumber)) {
        setError('Please enter a valid PAN number (format: ABCDE1234F)');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('You must be logged in to perform this action');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/clients',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Client created successfully:', response.data);
      navigate('/admin/user-roles');
    } catch (err) {
      console.error('Error creating client:', err);
      if (err.response?.status === 401) {
        setError('You are not authorized to perform this action');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid input data');
      } else {
        setError('Server error. Please try again later.');
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
              <h1>Add New Client</h1>
              <p>Create a new client profile</p>
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
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gstNumber">GST Number *</label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="29ABCDE1234F1Z5"
                    />
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
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                    />
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
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="panNumber">PAN Number</label>
                    <input
                      type="text"
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="bankDetails">Bank Details</label>
                  <textarea
                    id="bankDetails"
                    name="bankDetails"
                    value={formData.bankDetails}
                    onChange={handleChange}
                    placeholder="Bank name, account number, IFSC code"
                    rows="3"
                  ></textarea>
                </div>

                {error && <div className="error-message">{error}</div>}

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
