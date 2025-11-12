import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context.jsx';
import { getMyClientDetails, updateMyClientDetails } from '../services/api.js';
import './Profile.css';

const Profile = () => {
  const { user, isClient } = useAuth();
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (isClient() && user) {
        try {
          setLoading(true);
          setError('');
          console.log('Fetching client details for user:', user);
          const details = await getMyClientDetails();
          console.log('Client details received:', details);
          setClientDetails(details);
        } catch (err) {
          console.error('Error fetching client details:', err);
          setError('Failed to load client details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClientDetails();
  }, [user, isClient]);

  if (!user) {
    return (
      <div className="profile-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const maskSensitiveData = (data, visibleChars = 4) => {
    if (!data) return 'N/A';
    if (data.length <= visibleChars) return data;
    return data.slice(0, visibleChars) + '•'.repeat(data.length - visibleChars);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...clientDetails });
    setError('');
    setUpdateSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
    setError('');
    setUpdateSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setUpdateLoading(true);
      setError('');
      setUpdateSuccess('');

      const updatedDetails = await updateMyClientDetails(editForm);
      setClientDetails(updatedDetails);
      setIsEditing(false);
      setUpdateSuccess('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating client details:', err);
      setError(err || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-layout">

        {/* Content Cards */}
        <div className="profile-content">

          {/* Business Details - Main Content */}
          {isClient() && (
            <div className="profile-content-card">
              <div className="profile-card-header">
                <h2><i className="fas fa-building"></i> Business Information</h2>
                <p>Your company details and business information</p>

                {updateSuccess && (
                  <div className="profile-success-message">
                    <i className="fas fa-check-circle"></i>
                    {updateSuccess}
                  </div>
                )}
              </div>

              {loading && (
                <div className="profile-loading-section">
                  <div className="profile-loading-spinner"></div>
                  <p>Loading business details...</p>
                </div>
              )}

              {error && (
                <div className="profile-error-section">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()} className="profile-retry-btn">
                    <i className="fas fa-redo"></i> Retry
                  </button>
                </div>
              )}

              {!loading && !error && !clientDetails && isClient() && (
                <div className="profile-no-data-section">
                  <i className="fas fa-info-circle"></i>
                  <p>No client details found. This might be because:</p>
                  <ul>
                    <li>You haven't been set up as a client yet</li>
                    <li>There's an issue with your account</li>
                    <li>The data hasn't been synchronized</li>
                  </ul>
                  <button onClick={() => window.location.reload()} className="profile-retry-btn">
                    <i className="fas fa-redo"></i> Refresh Page
                  </button>
                </div>
              )}

              {clientDetails && !isEditing && (
                <div className="profile-business-layout">
                  {/* Left Side - Client Summary Card */}
                  <div className="profile-client-summary-card">
                    <div className="profile-client-avatar">
                      <div className="profile-company-initial">
                        {clientDetails.companyName ? clientDetails.companyName.charAt(0).toUpperCase() : 'C'}
                      </div>
                    </div>
                    <div className="profile-client-summary-info">
                      <h3 className="profile-company-title">{clientDetails.companyName || 'Company Name'}</h3>
                      <p className="profile-client-role">Business Client</p>
                      <div className="profile-client-meta">
                        <div className="profile-meta-item">
                          <i className="fas fa-calendar"></i>
                          <span>Since {formatDate(clientDetails.createdAt || new Date()).split(',')[1]}</span>
                        </div>
                        <div className="profile-meta-item">
                          <i className="fas fa-shield-check"></i>
                          <span>GST Verified</span>
                        </div>
                      </div>
                      <button onClick={handleEdit} className="profile-edit-profile-btn">
                        <i className="fas fa-edit"></i>
                        Edit Details
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Detailed Information */}
                  <div className="profile-client-details-section">
                    <div className="profile-details-grid">
                      <div className="profile-detail-group">
                        <h4><i className="fas fa-building"></i> Company Information</h4>
                        <div className="profile-detail-items">
                          <div className="profile-detail-item">
                            <label>Company Name</label>
                            <span className="profile-company-name">{clientDetails.companyName || 'Not provided'}</span>
                          </div>
                          <div className="profile-detail-item">
                            <label>GST Number</label>
                            <span className="profile-gst-number">{clientDetails.gstNumber || 'Not provided'}</span>
                          </div>
                          {clientDetails.panNumber && (
                            <div className="profile-detail-item">
                              <label>PAN Number</label>
                              <span className="profile-pan-number">{maskSensitiveData(clientDetails.panNumber, 6)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="profile-detail-group">
                        <h4><i className="fas fa-address-book"></i> Contact Information</h4>
                        <div className="profile-detail-items">
                          <div className="profile-detail-item">
                            <label>Business Email</label>
                            <span>{clientDetails.email || 'Not provided'}</span>
                          </div>
                          <div className="profile-detail-item">
                            <label>Phone Number</label>
                            <span>{clientDetails.phone || 'Not provided'}</span>
                          </div>
                          {clientDetails.contactPerson && (
                            <div className="profile-detail-item">
                              <label>Contact Person</label>
                              <span>{clientDetails.contactPerson}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="profile-detail-group profile-full-width">
                        <h4><i className="fas fa-map-marker-alt"></i> Business Address</h4>
                        <div className="profile-detail-items">
                          <div className="profile-detail-item">
                            <span className="profile-address-text">{clientDetails.address || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>

                      {clientDetails.bankDetails && (
                        <div className="profile-detail-group profile-full-width">
                          <h4><i className="fas fa-university"></i> Banking Information</h4>
                          <div className="profile-detail-items">
                            <div className="profile-detail-item">
                              <span className="profile-bank-details">{clientDetails.bankDetails}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="profile-edit-form">
                  <div className="profile-form-grid">
                    <div className="profile-form-group profile-full-width">
                      <label>
                        <i className="fas fa-building"></i>
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={editForm.companyName || ''}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>
                        <i className="fas fa-file-invoice"></i>
                        GST Number *
                      </label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={editForm.gstNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Enter GST number"
                        required
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>
                        <i className="fas fa-id-card"></i>
                        PAN Number
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={editForm.panNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Enter PAN number"
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>
                        <i className="fas fa-envelope-open"></i>
                        Business Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email || ''}
                        onChange={handleInputChange}
                        placeholder="Enter business email"
                        required
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>
                        <i className="fas fa-phone"></i>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>
                        <i className="fas fa-user-tie"></i>
                        Contact Person
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={editForm.contactPerson || ''}
                        onChange={handleInputChange}
                        placeholder="Enter contact person name"
                      />
                    </div>

                    <div className="profile-form-group profile-full-width">
                      <label>
                        <i className="fas fa-map-marker-alt"></i>
                        Business Address *
                      </label>
                      <textarea
                        name="address"
                        value={editForm.address || ''}
                        onChange={handleInputChange}
                        placeholder="Enter complete business address"
                        rows="3"
                        required
                      />
                    </div>

                    <div className="profile-form-group profile-full-width">
                      <label>
                        <i className="fas fa-university"></i>
                        Bank Details
                      </label>
                      <textarea
                        name="bankDetails"
                        value={editForm.bankDetails || ''}
                        onChange={handleInputChange}
                        placeholder="Enter bank details (optional)"
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <button
                      onClick={handleCancelEdit}
                      className="profile-cancel-btn"
                      disabled={updateLoading}
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="profile-save-btn"
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <>
                          <div className="profile-mini-spinner"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Non-Client Users */}
          {!isClient() && (
            <div className="profile-content-card">
              <div className="profile-card-header">
                <h2><i className="fas fa-user-circle"></i> Profile Information</h2>
                <p>Your account details and information</p>
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <i className="fas fa-signature"></i>
                  </div>
                  <div className="profile-info-content">
                    <label>Full Name</label>
                    <span>{user.name || 'Not provided'}</span>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="profile-info-content">
                    <label>Email Address</label>
                    <span>{user.email || 'Not provided'}</span>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <i className="fas fa-user-tag"></i>
                  </div>
                  <div className="profile-info-content">
                    <label>Account Type</label>
                    <span className={`profile-role-badge ${user.role}`}>
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;