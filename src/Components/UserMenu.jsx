import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context.jsx';
import './UserMenu.css';

const UserMenu = () => {
  const { user, logout, isAdmin, isClient } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name[0]
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        className="profile-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        {user.profilePic ? (
          <img 
            src={user.profilePic} 
            alt={user.name} 
            className="profile-pic"
          />
        ) : (
          <div className="profile-initials">
            {getInitials(user.name)}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            <div className="user-avatar">
              {user.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt={user.name} 
                  className="profile-pic-large"
                />
              ) : (
                <div className="profile-initials-large">
                  {getInitials(user.name)}
                </div>
              )}
            </div>
            <div className="user-details">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span className={`user-role ${user.role}`}>{user.role}</span>
            </div>
          </div>
          <div className="menu-items">
            {isAdmin() && (
              <button 
                onClick={() => { navigate('/admin'); setIsOpen(false); }}
                title="Admin Dashboard"
                className="admin-button"
              >
                <span>Admin Dashboard</span>
              </button>
            )}
            {isClient() && (
              <>
              <button 
                onClick={() => { navigate('/profile'); setIsOpen(false); }}
                title="View Profile Details"
              >
                <span>Profile Details</span>
              </button>
              <button 
                onClick={() => { navigate('/client-dashboard'); setIsOpen(false); }}
                title="Client Dashboard"
                className="client-button"
              >
                <span>Client Dashboard</span>
              </button>
              </>
              
            )}
            <button 
              onClick={handleLogout} 
              className="logout-button"
              title="Sign Out"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
