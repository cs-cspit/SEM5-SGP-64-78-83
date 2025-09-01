import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context.jsx';
import { getMyClientDetails } from '../services/api.js';
import './Profile.css';

const Profile = () => {
  const { user, isClient } = useAuth();
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (isClient()) {
        try {
          setLoading(true);
          setError('');
          const details = await getMyClientDetails();
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
                    <span>{user.name}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="info-content">
                    <label>Email Address</label>
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-user-tag"></i>
                  </div>
                  <div className="info-content">
                    <label>Account Type</label>
                    <span className={`role-badge ${user.role}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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

              {clientDetails && (
                <div className="info-grid">
                  <div className="info-item full-width">
                    <div className="info-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <div className="info-content">
                      <label>Company Name</label>
                      <span className="company-name">{clientDetails.companyName}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div className="info-content">
                      <label>GST Number</label>
                      <span className="gst-number">{clientDetails.gstNumber}</span>
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
                      <span>{clientDetails.email}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="info-content">
                      <label>Phone Number</label>
                      <span>{clientDetails.phone}</span>
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
                      <span className="address-text">{clientDetails.address}</span>
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
                      <span>{formatDate(clientDetails.createdAt)}</span>
                    </div>
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
                    <p>Update your personal details</p>
                  </div>
                  <button className="security-btn primary">
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
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