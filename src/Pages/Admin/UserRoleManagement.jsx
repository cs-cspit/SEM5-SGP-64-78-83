import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import axios from 'axios';
import AddClient from './AddClient';
import './UserRoleManagement.css';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAddClientSuccess = (data) => {
    setUsers([...users, data.user]);
    setSuccessMessage('Client added successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setError('');
      setSuccessMessage('');
      
      await axios.patch('http://localhost:5000/api/users/role', 
        { userId, role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      );
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      setSuccessMessage('Role updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-role-management">
      <div className="page-header">
        <button onClick={() => navigate('/admin')} className="back-button">
          ← Back to Admin Panel
        </button>
        <h2>User Role Management</h2>
        <button 
          onClick={() => setShowAddClient(true)} 
          className="add-client-button"
        >
          + Add Client
        </button>
      </div>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {showAddClient && (
        <AddClient
          onClose={() => setShowAddClient(false)}
          onSuccess={handleAddClientSuccess}
        />
      )}
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRoleManagement;
