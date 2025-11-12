import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import axios from 'axios';
import AdminLayout from '../../Components/AdminLayout.jsx';
import Pagination from '../../Components/Pagination.jsx';
import './UserRoleManagement.css';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedClientDetails, setSelectedClientDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Remove user from local state
      setUsers(users.filter(user => user._id !== userId));
      setSuccessMessage('User deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('Failed to delete user. Please try again.');
      }
      setTimeout(() => setError(''), 5000);
    }
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
    } catch (err) {
      setError('Failed to fetch users');
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

  const handleViewClientDetails = async (userId) => {
    setLoadingDetails(true);
    setShowDetailsModal(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`http://localhost:5000/api/clients/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSelectedClientDetails(response.data);
    } catch (err) {
      console.error('Error fetching client details:', err);
      setError('Failed to fetch client details');
      setShowDetailsModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedClientDetails(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <AdminLayout>
      {/* Client Details Modal */}
      {showDetailsModal && (
        <div className="client-details-modal-overlay" onClick={closeDetailsModal}>
          <div className="client-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-user-circle"></i> Client Details</h2>
              <button className="modal-close-btn" onClick={closeDetailsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {loadingDetails ? (
              <div className="modal-loading">
                <div className="spinner"></div>
                <p>Loading client details...</p>
              </div>
            ) : selectedClientDetails ? (
              <div className="modal-content">
                <div className="detail-section">
                  <h3><i className="fas fa-building"></i> Company Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Company Name:</label>
                      <span>{selectedClientDetails.companyName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Contact Person:</label>
                      <span>{selectedClientDetails.contactPerson || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3><i className="fas fa-address-card"></i> Contact Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedClientDetails.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedClientDetails.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Address:</label>
                      <span>{selectedClientDetails.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3><i className="fas fa-file-invoice"></i> Tax Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>GST Number:</label>
                      <span>{selectedClientDetails.gstNumber || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>PAN Number:</label>
                      <span>{selectedClientDetails.panNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {selectedClientDetails.bankDetails && (
                  <div className="detail-section">
                    <h3><i className="fas fa-university"></i> Bank Details</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Bank Name:</label>
                        <span>{selectedClientDetails.bankDetails.bankName || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Account Number:</label>
                        <span>{selectedClientDetails.bankDetails.accountNumber || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <label>IFSC Code:</label>
                        <span>{selectedClientDetails.bankDetails.ifscCode || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Branch:</label>
                        <span>{selectedClientDetails.bankDetails.branch || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="modal-error">
                <i className="fas fa-exclamation-circle"></i>
                <p>No client details found for this user.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="user-role-management">
        <div className="page-header">
          <div className="header-content">
            <h1>Client Management</h1>
            <p>Manage clients and user permissions across the system</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin/add-client');
            }}
            className="add-client-button"
          >
            <span className="button-icon">+</span>
            Add New User
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon"><i className="fas fa-exclamation-triangle"></i></span>
            {error}
          </div>
        )}

        <div className="users-table-container">
          <div className="table-header">
            <h3>All Users</h3>
            <div className="table-stats">
              <span>{users.length} total users</span>
            </div>
          </div>

          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>User Information</th>
                  <th>Email Address</th>
                  <th>Current Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.name}</div>
                          <div className="user-id">ID: {user._id?.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="email-cell">{user.email}</div>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                        </select>
                        {user.role === 'client' && (
                          <button
                            type="button"
                            onClick={() => handleViewClientDetails(user._id)}
                            className="view-details-button"
                            title={`View ${user.name}'s details`}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteUser(user._id, user.name);
                          }}
                          className="delete-button"
                          title={`Delete ${user.name}`}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={users.length}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserRoleManagement;
