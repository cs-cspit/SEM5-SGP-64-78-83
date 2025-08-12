import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import './AdminPanel.css';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      <div className="admin-panel-content">
        <div className="welcome-message">
          <h2>Welcome to the Admin Panel</h2>
          <p>Here you can manage users and system settings.</p>
        </div>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Your Role</h3>
            <div className="stat-value">Administrator</div>
            <p>Full system access</p>
          </div>
          {/* Add more admin features here */}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
