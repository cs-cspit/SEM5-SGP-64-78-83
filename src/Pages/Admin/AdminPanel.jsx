import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import { getAdminDashboardStats } from '../../services/api.js';
import AdminLayout from '../../Components/AdminLayout.jsx';
import './AdminPanel.css';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    paymentsReceived: 0,
    collectionRate: 0,
    recentInvoices: [],
    billsByStatus: {
      paid: 0,
      pending: 0,
      sent: 0,
      viewed: 0,
      overdue: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch real dashboard data from database
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAdminDashboardStats();
        console.log('Admin dashboard data:', data); // Debug log
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
        // Set fallback data in case of error
        setDashboardData({
          totalClients: 0,
          totalInvoices: 0,
          totalRevenue: 0,
          pendingPayments: 0,
          paymentsReceived: 0,
          collectionRate: 0,
          recentInvoices: [],
          billsByStatus: {
            paid: 0,
            pending: 0,
            sent: 0,
            viewed: 0,
            overdue: 0
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!isAdmin()) {
    return null;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const dashboardStats = [
    {
      title: 'Total Clients',
      value: isLoading ? '...' : dashboardData.totalClients.toString(),
      subtitle: 'Registered clients',
      icon: 'fas fa-users',
      iconColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: dashboardData.totalClients > 0 ? `${dashboardData.totalClients} clients` : 'No clients yet',
      trendPositive: true
    },
    {
      title: 'Total Invoices',
      value: isLoading ? '...' : dashboardData.totalInvoices.toString(),
      subtitle: 'All time invoices',
      icon: 'fas fa-file-invoice',
      iconColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: `${dashboardData.billsByStatus.paid} paid, ${dashboardData.billsByStatus.pending + dashboardData.billsByStatus.sent + dashboardData.billsByStatus.viewed} pending`,
      trendPositive: true
    },
    {
      title: 'Total Revenue',
      value: isLoading ? '...' : formatCurrency(dashboardData.totalRevenue),
      subtitle: 'All paid invoices',
      icon: 'fas fa-rupee-sign',
      iconColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      trend: dashboardData.totalRevenue > 0 ? 'From completed payments' : 'No revenue yet',
      trendPositive: true
    },
    {
      title: 'Pending Payments',
      value: isLoading ? '...' : formatCurrency(dashboardData.pendingPayments),
      subtitle: `${dashboardData.billsByStatus.pending + dashboardData.billsByStatus.sent + dashboardData.billsByStatus.viewed} outstanding invoices`,
      icon: 'fas fa-exclamation-triangle',
      iconColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      trend: dashboardData.pendingPayments > 0 ? 'Awaiting payment' : 'All caught up!',
      trendPositive: dashboardData.pendingPayments === 0
    },
    {
      title: 'Payments Received',
      value: isLoading ? '...' : formatCurrency(dashboardData.paymentsReceived),
      subtitle: 'This month',
      icon: 'fas fa-credit-card',
      iconColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      trend: dashboardData.paymentsReceived > 0 ? 'Monthly collections' : 'No payments this month',
      trendPositive: true
    },
    {
      title: 'Collection Rate',
      value: isLoading ? '...' : `${dashboardData.collectionRate}%`,
      subtitle: 'Payment efficiency',
      icon: 'fas fa-chart-line',
      iconColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      trend: dashboardData.collectionRate >= 80 ? 'Excellent rate' : 
             dashboardData.collectionRate >= 60 ? 'Good rate' : 'Needs improvement',
      trendPositive: dashboardData.collectionRate >= 70
    }
  ];

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Monitor your business performance and manage operations efficiently with real-time data from your database.</p>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}
        </div>

        <div className="dashboard-stats">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="dashboard-stat-card">
              <div className="stat-header">
                <h3>{stat.title}</h3>
                <div 
                  className="stat-icon" 
                  style={{ background: stat.iconColor }}
                >
                  <i className={stat.icon}></i>
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-subtitle">
                {stat.subtitle}
                {stat.trend && (
                  <span className={`stat-trend ${stat.trendPositive ? 'positive' : 'negative'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Invoices Section */}
        {!isLoading && dashboardData.recentInvoices && dashboardData.recentInvoices.length > 0 && (
          <div className="recent-invoices-section">
            <h2>Recent Invoices</h2>
            <div className="recent-invoices-table">
              <div className="table-header">
                <span>Invoice ID</span>
                <span>Company</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {dashboardData.recentInvoices.map((invoice, index) => (
                <div key={index} className="table-row">
                  <span className="invoice-id">{invoice.id}</span>
                  <span className="company-name">{invoice.companyName}</span>
                  <span className="amount">{formatCurrency(invoice.amount)}</span>
                  <span className={`status status-${invoice.status}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                  <span className="date">
                    {new Date(invoice.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dashboard-actions">
          <div className="action-cards">
            <div className="action-card" onClick={() => navigate('/admin/user-roles')}>
              <div className="action-icon"><i className="fas fa-users"></i></div>
              <h3>Manage Clients</h3>
              <p>Add, edit, and manage client information and user roles</p>
              <div className="action-arrow"><i className="fas fa-arrow-right"></i></div>
            </div>
            
            <div className="action-card" onClick={() => navigate('/admin/add-client')}>
              <div className="action-icon"><i className="fas fa-plus"></i></div>
              <h3>Add New Client</h3>
              <p>Quickly add new clients to your system</p>
              <div className="action-arrow"><i className="fas fa-arrow-right"></i></div>
            </div>
            
            <div className="action-card" onClick={() => navigate('/admin/invoices')}>
              <div className="action-icon"><i className="fas fa-file-invoice"></i></div>
              <h3>Manage Invoices</h3>
              <p>View, create, and manage all invoices</p>
              <div className="action-arrow"><i className="fas fa-arrow-right"></i></div>
            </div>
            
            <div className="action-card coming-soon">
              <div className="action-icon"><i className="fas fa-chart-bar"></i></div>
              <h3>Generate Reports</h3>
              <p>Create detailed financial and performance reports</p>
              <div className="coming-soon-badge">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
