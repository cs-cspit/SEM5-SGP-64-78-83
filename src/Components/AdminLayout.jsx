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
      icon: 'fas fa-chart-bar',
      path: '/admin',
      active: true
    },
    {
      id: 'clients',
      name: 'Clients',
      icon: 'fas fa-users',
      path: '/admin/user-roles',
      active: true
    },
    {
      id: 'invoices',
      name: 'Invoices',
      icon: 'fas fa-file-invoice',
      path: '/admin/invoices',
      active: true
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: 'fas fa-credit-card',
      path: '/admin/payments',
      active: true
    },
    {
      id: 'quote-form',
      name: 'Quote Form',
      icon: 'fas fa-file-text',
      path: '/admin/quote-form',
      active: true
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: 'fas fa-cogs',
      path: '/admin/settings',
      active: false
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: 'fas fa-wrench',
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Navigate to the appropriate route
                switch (item.id) {
                  case 'dashboard':
                    navigate('/admin');
                    break;
                  case 'clients':
                    navigate('/admin/user-roles');
                    break;
                  case 'invoices':
                    navigate('/admin/invoices');
                    break;
                  case 'payments':
                    navigate('/admin/payments');
                    break;
                  case 'quote-form':
                    navigate('/admin/quote-form');
                    break;
                  default:
                    // For inactive items, just log for now
                    console.log(`${item.name} clicked - Coming soon!`);
                }
              }}
              style={{
                cursor: (item.id === 'dashboard' || item.id === 'clients' || item.id === 'invoices' || item.id === 'payments' || item.id === 'quote-form') ? 'pointer' : 'not-allowed',
                opacity: (item.id === 'dashboard' || item.id === 'clients' || item.id === 'invoices' || item.id === 'payments' || item.id === 'quote-form') ? 1 : 0.5
              }}
            >
              <span className="nav-icon"><i className={item.icon}></i></span>
              <span className="nav-text">{item.name}</span>
            </div>
          ))}
        </nav>
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
