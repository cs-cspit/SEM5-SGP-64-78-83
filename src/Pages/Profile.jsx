import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context.jsx';
import { getMyClientDetails, updateMyClientDetails } from '../services/api.js';
import './Profile.css';

const Profile = () => {
  const { user, isClient } = useAuth();
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
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
    setActiveTab('business'); // Automatically switch to business tab
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

        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-cover">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                )}
                <div className="avatar-status"></div>
              </div>
            </div>
          </div>

          <div className="profile-header-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-meta">
              <span className={`role-badge ${user.role}`}>
                <i className={`fas ${user.role === 'admin' ? 'fa-crown' : user.role === 'client' ? 'fa-building' : 'fa-user'}`}></i>
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <i className="fas fa-user-circle"></i>
            Personal Information
          </button>
          {isClient() && (
            <button
              className={`tab-button ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              <i className="fas fa-building"></i>
              Business Details
            </button>
          )}
          <button
            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i className="fas fa-shield-alt"></i>
            Security
          </button>
        </div>

        {/* Content Cards */}
        <div className="profile-content">

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="content-card">
              <div className="card-header">
                <h2><i className="fas fa-user-circle"></i> Personal Information</h2>
                <p>Manage your personal details and preferences</p>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-signature"></i>
                  </div>
                  <div className="info-content">
                    <label>Full Name</label>
                    <span>{user.name || 'Not provided'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="info-content">
                    <label>Email Address</label>
                    <span>{user.email || 'Not provided'}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-user-tag"></i>
                  </div>
                  <div className="info-content">
                    <label>Account Type</label>
                    <span className={`role-badge ${user.role}`}>
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Details Tab */}
          {activeTab === 'business' && isClient() && (
            <div className="content-card">
              <div className="card-header">
                <h2><i className="fas fa-building"></i> Business Information</h2>
                <p>Your company details and business information</p>

                {updateSuccess && (
                  <div className="success-message">
                    <i className="fas fa-check-circle"></i>
                    {updateSuccess}
                  </div>
                )}
              </div>

              {loading && (
                <div className="loading-section">
                  <div className="loading-spinner"></div>
                  <p>Loading business details...</p>
                </div>
              )}

              {error && (
                <div className="error-section">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()} className="retry-btn">
                    <i className="fas fa-redo"></i> Retry
                  </button>
                </div>
              )}

              {!loading && !error && !clientDetails && isClient() && (
                <div className="no-data-section">
                  <i className="fas fa-info-circle"></i>
                  <p>No client details found. This might be because:</p>
                  <ul>
                    <li>You haven't been set up as a client yet</li>
                    <li>There's an issue with your account</li>
                    <li>The data hasn't been synchronized</li>
                  </ul>
                  <button onClick={() => window.location.reload()} className="retry-btn">
                    <i className="fas fa-redo"></i> Refresh Page
                  </button>
                </div>
              )}

              {clientDetails && !isEditing && (
                <div className="info-grid">
                  <div className="info-item full-width">
                    <div className="info-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <div className="info-content">
                      <label>Company Name</label>
                      <span className="company-name">{clientDetails.companyName || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div className="info-content">
                      <label>GST Number</label>
                      <span className="gst-number">{clientDetails.gstNumber || 'Not provided'}</span>
                    </div>
                  </div>

                  {clientDetails.panNumber && (
                    <div className="info-item">
                      <div className="info-icon">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <div className="info-content">
                        <label>PAN Number</label>
                        <span className="pan-number">{maskSensitiveData(clientDetails.panNumber, 6)}</span>
                      </div>
                    </div>
                  )}

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-envelope-open"></i>
                    </div>
                    <div className="info-content">
                      <label>Business Email</label>
                      <span>{clientDetails.email || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="info-content">
                      <label>Phone Number</label>
                      <span>{clientDetails.phone || 'Not provided'}</span>
                    </div>
                  </div>

                  {clientDetails.contactPerson && (
                    <div className="info-item">
                      <div className="info-icon">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      <div className="info-content">
                        <label>Contact Person</label>
                        <span>{clientDetails.contactPerson}</span>
                      </div>
                    </div>
                  )}

                  <div className="info-item full-width">
                    <div className="info-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="info-content">
                      <label>Business Address</label>
                      <span className="address-text">{clientDetails.address || 'Not provided'}</span>
                    </div>
                  </div>

                  {clientDetails.bankDetails && (
                    <div className="info-item full-width">
                      <div className="info-icon">
                        <i className="fas fa-university"></i>
                      </div>
                      <div className="info-content">
                        <label>Bank Details</label>
                        <span className="bank-details">{clientDetails.bankDetails}</span>
                      </div>
                    </div>
                  )}

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-handshake"></i>
                    </div>
                    <div className="info-content">
                      <label>Client Since</label>
                      <span>{formatDate(clientDetails.createdAt || new Date())}</span>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="edit-form">
                  <div className="form-grid">
                    <div className="form-group full-width">
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

                    <div className="form-group">
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

                    <div className="form-group">
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

                    <div className="form-group">
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

                    <div className="form-group">
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

                    <div className="form-group">
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

                    <div className="form-group full-width">
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

                    <div className="form-group full-width">
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

                  <div className="form-actions">
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-btn"
                      disabled={updateLoading}
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="save-btn"
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <>
                          <div className="mini-spinner"></div>
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

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="content-card">
              <div className="card-header">
                <h2><i className="fas fa-shield-alt"></i> Security Settings</h2>
                <p>Manage your account security and password settings</p>
              </div>

              <div className="security-section">
                <div className="security-item">
                  <div className="security-info">
                    <h3><i className="fas fa-key"></i> Password</h3>
                    <p>Last updated: {formatDate(user.createdAt)}</p>
                  </div>
                  <button className="security-btn">
                    <i className="fas fa-edit"></i>
                    Change Password
                  </button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3><i className="fas fa-user-edit"></i> Profile Information</h3>
                    <p>{isClient() ? 'Update your business details' : 'Update your personal details'}</p>
                  </div>
                  {isClient() && clientDetails ? (
                    <button onClick={handleEdit} className="security-btn primary">
                      <i className="fas fa-edit"></i>
                      Edit Business Details
                    </button>
                  ) : (
                    <button className="security-btn primary">
                      <i className="fas fa-edit"></i>
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3><i className="fas fa-sign-out-alt"></i> Account Access</h3>
                    <p>Manage your login sessions</p>
                  </div>
                  <button className="security-btn danger">
                    <i className="fas fa-power-off"></i>
                    Sign Out All Devices
                  </button>
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