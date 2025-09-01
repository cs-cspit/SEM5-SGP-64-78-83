import React from 'react';
import { useAuth } from '../context/auth-context.jsx';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.name} className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1>My Profile</h1>
        </div>
        
        <div className="profile-details">
          <div className="detail-row">
            <label>Full Name:</label>
            <span>{user.name}</span>
          </div>
          
          <div className="detail-row">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          
          <div className="detail-row">
            <label>Role:</label>
            <span className={`role-badge ${user.role}`}>{user.role}</span>
          </div>
          
          <div className="detail-row">
            <label>Member Since:</label>
            <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="edit-profile-btn">Edit Profile</button>
          <button className="change-password-btn">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
