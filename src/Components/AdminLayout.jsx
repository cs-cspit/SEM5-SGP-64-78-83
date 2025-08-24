import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth-context.jsx';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '📊',
      path: '/admin',
      active: true 
    },
    { 
      id: 'clients', 
      name: 'Clients', 
      icon: '👥',
      path: '/admin/user-roles',
      active: true 
    },
    { 
      id: 'invoices', 
      name: 'Invoices', 
      icon: '📄',
      path: '/admin/invoices',
      active: true 
    },
    { 
      id: 'payments', 
      name: 'Payments', 
      icon: '💳',
      path: '/admin/payments',
      active: false 
    },
    { 
      id: 'reports', 
      name: 'Reports', 
      icon: '📈',
      path: '/admin/reports',
      active: false 
    },
    { 
      id: 'admin', 
      name: 'Admin', 
      icon: '⚙️',
      path: '/admin/settings',
      active: false 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: '🔧',
      path: '/admin/general-settings',
      active: false 
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          
          <button 
              className="sidebar-toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              ☰
            </button>
            <div className="sidebar-logo">
            {/* <div className="logo-icon">📋</div> */}
            <div className="logo-text">
              <h3>Admin</h3>
              {/* <p>Management System</p> */}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'dashboard') {
                  navigate('/admin');
                } else if (item.id === 'clients') {
                  navigate('/admin/user-roles');
                } else if (item.id === 'invoices') {
                  navigate('/admin/invoices');
                } else {
                  // For now, only dashboard, clients, and invoices are functional
                  // Future functionality can be added here
                  console.log(`${item.name} clicked - Coming soon!`);
                }
              }}
              style={{ 
                cursor: (item.id === 'dashboard' || item.id === 'clients' || item.id === 'invoices') ? 'pointer' : 'not-allowed',
                opacity: (item.id === 'dashboard' || item.id === 'clients' || item.id === 'invoices') ? 1 : 0.5 
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile" onClick={handleLogout}>
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'N'}
            </div>
            <span className="logout-text">Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            {/* <button 
              className="sidebar-toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              ☰
            </button> */}
            {/* <h1>Invoice Management System</h1> */}
          </div>
          <div className="header-right">
            <div className="user-info">
              <span>Welcome, {user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
