import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context.jsx';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalInvoices: 0,
    pendingPayments: 0,
    totalSpent: 0,
    recentInvoices: []
  });

  useEffect(() => {
    // Fetch client-specific dashboard data
    // This would typically come from an API call
    setDashboardData({
      totalInvoices: 12,
      pendingPayments: 2,
      totalSpent: 45000,
      recentInvoices: [
        { id: 'INV-001', amount: 15000, status: 'Paid', date: '2025-08-15' },
        { id: 'INV-002', amount: 8500, status: 'Pending', date: '2025-08-20' },
        { id: 'INV-003', amount: 12000, status: 'Paid', date: '2025-08-25' }
      ]
    });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="client-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's your account overview</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon invoices">
              <i className="fas fa-file-invoice"></i>
            </div>
            <div className="stat-content">
              <h3>Total Invoices</h3>
              <div className="stat-value">{dashboardData.totalInvoices}</div>
              <div className="stat-subtitle">All time</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>Pending Payments</h3>
              <div className="stat-value">{dashboardData.pendingPayments}</div>
              <div className="stat-subtitle">Awaiting payment</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon spent">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="stat-content">
              <h3>Total Spent</h3>
              <div className="stat-value">{formatCurrency(dashboardData.totalSpent)}</div>
              <div className="stat-subtitle">All time</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="recent-invoices">
            <h2>Recent Invoices</h2>
            <div className="invoices-table">
              <div className="table-header">
                <span>Invoice ID</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {dashboardData.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="table-row">
                  <span>{invoice.id}</span>
                  <span>{formatCurrency(invoice.amount)}</span>
                  <span className={`status ${invoice.status.toLowerCase()}`}>
                    {invoice.status}
                  </span>
                  <span>{new Date(invoice.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn">
                <i className="fas fa-eye"></i>
                View All Invoices
              </button>
              <button className="action-btn">
                <i className="fas fa-download"></i>
                Download Reports
              </button>
              <button className="action-btn">
                <i className="fas fa-envelope"></i>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
