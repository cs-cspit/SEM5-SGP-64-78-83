import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import AdminLayout from '../../Components/AdminLayout.jsx';
import './AdminPanel.css';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    clients: 0,
    invoices: 0,
    revenue: 0,
    pendingPayments: 0,
    paymentsReceived: 0,
    collectionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          clients: 24,
          invoices: 156,
          revenue: 452310,
          pendingPayments: 84200,
          paymentsReceived: 368110,
          collectionRate: 87
        });
        setIsLoading(false);
      }, 1000);
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
      value: isLoading ? '...' : dashboardData.clients.toString(),
      subtitle: 'Active clients',
      icon: '👥',
      iconColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: '+3 this month',
      trendPositive: true
    },
    {
      title: 'Total Invoices',
      value: isLoading ? '...' : dashboardData.invoices.toString(),
      subtitle: 'This month',
      icon: '📄',
      iconColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: '+12% from last month',
      trendPositive: true
    },
    {
      title: 'Total Revenue',
      value: isLoading ? '...' : formatCurrency(dashboardData.revenue),
      subtitle: 'This month',
      icon: '₹',
      iconColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      trend: '+12% from last month',
      trendPositive: true
    },
    {
      title: 'Pending Payments',
      value: isLoading ? '...' : formatCurrency(dashboardData.pendingPayments),
      subtitle: '12 overdue invoices',
      icon: '⚠️',
      iconColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      trend: '-5% improvement',
      trendPositive: true
    },
    {
      title: 'Payments Received',
      value: isLoading ? '...' : formatCurrency(dashboardData.paymentsReceived),
      subtitle: 'This month',
      icon: '💳',
      iconColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      trend: '+8% from last month',
      trendPositive: true
    },
    {
      title: 'Collection Rate',
      value: isLoading ? '...' : `${dashboardData.collectionRate}%`,
      subtitle: 'Payment efficiency',
      icon: '📈',
      iconColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      trend: '+5% improvement',
      trendPositive: true
    }
  ];

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to your comprehensive invoice management system. Monitor your business performance and manage your operations efficiently.</p>
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
                  {stat.icon}
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

        <div className="dashboard-actions">
          <div className="action-cards">
            <div className="action-card" onClick={() => navigate('/admin/user-roles')}>
              <div className="action-icon">👥</div>
              <h3>Manage Clients</h3>
              <p>Add, edit, and manage client information and user roles</p>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card" onClick={() => navigate('/admin/add-client')}>
              <div className="action-icon">➕</div>
              <h3>Add New Client</h3>
              <p>Quickly add new clients to your system</p>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card coming-soon">
              <div className="action-icon">📊</div>
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
