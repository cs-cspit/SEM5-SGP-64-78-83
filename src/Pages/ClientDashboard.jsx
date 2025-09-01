import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context.jsx';
import { useNavigate } from 'react-router-dom';
import { getClientDashboardStats, getMyBills, getMyBill } from '../services/api.js';
import { viewInvoice, downloadInvoiceHTML } from '../utils/invoiceGenerator.js';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalInvoices: 0,
    pendingPayments: 0,
    totalSpent: 0,
    recentInvoices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch real client dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching client dashboard stats...');
        const stats = await getClientDashboardStats();
        console.log('Dashboard stats received:', stats);
        setDashboardData(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
        // Set default data on error
        setDashboardData({
          totalInvoices: 0,
          pendingPayments: 0,
          totalSpent: 0,
          recentInvoices: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'client') {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleViewAllInvoices = () => {
    // Navigate to invoices page when implemented
    console.log('Navigate to all invoices');
    // For now, we'll show all bills in console
    fetchAllBills();
  };

  const fetchAllBills = async () => {
    try {
      const bills = await getMyBills();
      console.log('All client bills:', bills);
      // You can implement a modal or separate page to show all bills
    } catch (error) {
      console.error('Error fetching all bills:', error);
    }
  };

  const handleDownloadInvoice = async (billId) => {
    try {
      console.log('Downloading invoice:', billId);
      const bill = await getMyBill(billId);
      console.log('Bill details for download:', bill);
      
      // Transform bill data to match invoice generator format
      const invoiceData = {
        invoiceNumber: `INV-${String(bill.invoiceNo).padStart(3, '0')}`,
        date: bill.date,
        companyName: bill.companyName,
        companyAddress: bill.address,
        siteLocation: bill.workingSite,
        clientName: bill.clientName,
        gstNumber: bill.companyGst,
        totalAmount: bill.netAmount, // Base amount before GST
        items: bill.products ? bill.products.map(product => ({
          description: product.productName,
          particular: product.productName,
          quantity: product.quantity,
          hsn: product.hsn,
          rate: product.rate,
          gstRate: product.gstRate || 9,
          basicAmount: product.basicAmount,
          cgst: product.cgst,
          sgst: product.sgst,
          amount: product.total
        })) : [],
        workDescription: bill.products && bill.products.length > 0 ? 
          bill.products.map(p => p.productName).join(', ') : 
          'Electrical Services'
      };

      // Use the same invoice generator as InvoiceList
      downloadInvoiceHTML(invoiceData);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const handleViewInvoice = async (billId) => {
    try {
      console.log('Viewing invoice:', billId);
      const bill = await getMyBill(billId);
      
      // Transform bill data to match invoice generator format
      const invoiceData = {
        invoiceNumber: `INV-${String(bill.invoiceNo).padStart(3, '0')}`,
        date: bill.date,
        companyName: bill.companyName,
        companyAddress: bill.address,
        siteLocation: bill.workingSite,
        clientName: bill.clientName,
        gstNumber: bill.companyGst,
        totalAmount: bill.netAmount, // Base amount before GST
        items: bill.products ? bill.products.map(product => ({
          description: product.productName,
          particular: product.productName,
          quantity: product.quantity,
          hsn: product.hsn,
          rate: product.rate,
          gstRate: product.gstRate || 9,
          basicAmount: product.basicAmount,
          cgst: product.cgst,
          sgst: product.sgst,
          amount: product.total
        })) : [],
        workDescription: bill.products && bill.products.length > 0 ? 
          bill.products.map(p => p.productName).join(', ') : 
          'Electrical Services'
      };

      // Use the same invoice generator as InvoiceList (view without auto-print)
      viewInvoice(invoiceData);
    } catch (error) {
      console.error('Error viewing invoice:', error);
      alert('Failed to view invoice. Please try again.');
    }
  };

  const generateInvoicePDF = (bill) => {
    // This function is now replaced by handleDownloadInvoice using invoiceGenerator
    console.log('Using new invoice generator format');
  };

  const handleDownloadReports = async () => {
    try {
      const bills = await getMyBills();
      generateReportHTML(bills);
    } catch (error) {
      console.error('Error generating reports:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const generateReportHTML = (bills) => {
    // Generate a comprehensive report in the same style as invoices
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice Report - ${user?.name}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: white;
            margin: 0;
            padding: 20px;
          }
          
          .report-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #000;
            background: white;
          }
          
          .report-header {
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: start;
            padding: 15px;
            border-bottom: 2px solid #000;
          }
          
          .company-info h1 {
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 1px;
          }
          
          .company-info .electricals {
            font-size: 16px;
            font-style: italic;
            margin-left: 120px;
            margin-top: -5px;
          }
          
          .header-right {
            text-align: right;
            font-size: 11px;
            line-height: 1.2;
          }
          
          .report-title {
            text-align: center;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            border-bottom: 1px solid #000;
          }
          
          .client-info {
            padding: 15px;
            border-bottom: 1px solid #000;
          }
          
          .report-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .report-table th,
          .report-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          
          .report-table th {
            background: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          
          .amount-col {
            text-align: right;
          }
          
          .status-paid { color: #22c55e; font-weight: bold; }
          .status-pending { color: #f59e0b; font-weight: bold; }
          .status-viewed { color: #3b82f6; font-weight: bold; }
          .status-sent { color: #8b5cf6; font-weight: bold; }
          .status-overdue { color: #ef4444; font-weight: bold; }
          
          .summary-section {
            padding: 15px;
            border-top: 2px solid #000;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .summary-box {
            padding: 10px;
            border: 1px solid #000;
          }
          
          @media print {
            body { margin: 0; padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <!-- Header -->
          <div class="report-header">
            <div class="company-info">
              <h1>JAY JALARAM</h1>
              <div class="electricals">Electricals</div>
            </div>
            <div class="header-right">
              <div>Juna Jeen Hanuman Tekri,</div>
              <div>Opp. Ramji Mandir, Rander, Surat - 5</div>
              <div>Mo. No.- 7016388853</div>
              <div>Email Id:- jayalarameelectricals@gmail.com</div>
            </div>
          </div>

          <!-- Report Title -->
          <div class="report-title">
            INVOICE REPORT
          </div>

          <!-- Client Info -->
          <div class="client-info">
            <div><strong>Client Name:</strong> ${user?.name}</div>
            <div><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
            <div><strong>Total Invoices:</strong> ${bills.length}</div>
          </div>

          <!-- Invoices Table -->
          <table class="report-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${bills.map(bill => `
                <tr>
                  <td>INV-${String(bill.invoiceNo).padStart(3, '0')}</td>
                  <td>${new Date(bill.date).toLocaleDateString('en-GB')}</td>
                  <td>${bill.products && bill.products.length > 0 ? 
                    bill.products.map(p => p.productName).join(', ') : 
                    'Electrical Services'}</td>
                  <td class="amount-col">₹${bill.totalAmount.toLocaleString('en-IN')}</td>
                  <td class="status-${bill.status}">${bill.status.toUpperCase()}</td>
                  <td>${new Date(bill.paymentDueDate).toLocaleDateString('en-GB')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Summary Section -->
          <div class="summary-section">
            <div class="summary-box">
              <h4>Invoice Summary</h4>
              <div><strong>Total Invoices:</strong> ${bills.length}</div>
              <div><strong>Paid Invoices:</strong> ${bills.filter(b => b.status === 'paid').length}</div>
              <div><strong>Pending Invoices:</strong> ${bills.filter(b => ['pending', 'sent', 'viewed'].includes(b.status)).length}</div>
              <div><strong>Overdue Invoices:</strong> ${bills.filter(b => b.status === 'overdue').length}</div>
            </div>
            
            <div class="summary-box">
              <h4>Amount Summary</h4>
              <div><strong>Total Amount:</strong> ₹${bills.reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString('en-IN')}</div>
              <div><strong>Paid Amount:</strong> ₹${bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString('en-IN')}</div>
              <div><strong>Pending Amount:</strong> ₹${bills.filter(b => ['pending', 'sent', 'viewed'].includes(b.status)).reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_Report_${user?.name}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleContactSupport = () => {
    navigate('/contact');
  };

  if (loading) {
    return (
      <div className="client-dashboard-page">
        <div className="client-loading-state">
          <div className="client-loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-dashboard-page">
        <div className="client-dashboard-container">
          <div className="client-error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Unable to Load Dashboard</h3>
            <p>{error}</p>
            <button className="client-retry-btn" onClick={() => window.location.reload()}>
              <i className="fas fa-redo"></i>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-dashboard-page">
      <div className="client-dashboard-container">
        <div className="client-dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's your account overview</p>
        </div>

        <div className="client-stats-grid">
          <div className="client-stat-card">
            <div className="client-stat-icon client-invoices">
              <i className="fas fa-file-invoice"></i>
            </div>
            <div className="client-stat-content">
              <h3>Total Invoices</h3>
              <div className="client-stat-value">{dashboardData.totalInvoices}</div>
              <div className="client-stat-subtitle">All time</div>
            </div>
          </div>

          <div className="client-stat-card">
            <div className="client-stat-icon client-pending">
              <i className="fas fa-clock"></i>
            </div>
            <div className="client-stat-content">
              <h3>Pending Payments</h3>
              <div className="client-stat-value">{dashboardData.pendingPayments}</div>
              <div className="client-stat-subtitle">Awaiting payment</div>
            </div>
          </div>

          <div className="client-stat-card">
            <div className="client-stat-icon client-spent">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="client-stat-content">
              <h3>Total Spent</h3>
              <div className="client-stat-value">{formatCurrency(dashboardData.totalSpent)}</div>
              <div className="client-stat-subtitle">All time</div>
            </div>
          </div>
        </div>

        <div className="client-dashboard-content">
          <div className="client-recent-invoices">
            <h2>Recent Invoices</h2>
            {dashboardData.recentInvoices.length > 0 ? (
              <div className="client-invoices-table">
                <div className="client-table-header">
                  <span>Invoice ID</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span>Date</span>
                  <span>Actions</span>
                </div>
                {dashboardData.recentInvoices.map((invoice) => (
                  <div key={invoice._id || invoice.id} className="client-table-row">
                    <span className="client-invoice-number">
                      {invoice.id}
                    </span>
                    <span>{formatCurrency(invoice.amount)}</span>
                    <span className={`client-status client-status-${invoice.status.toLowerCase()}`}>
                      {invoice.status}
                    </span>
                    <span>{new Date(invoice.date).toLocaleDateString('en-GB')}</span>
                    <span className="client-actions">
                      <button 
                        className="client-view-btn" 
                        onClick={() => handleViewInvoice(invoice._id)}
                        title="View Invoice"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="client-download-btn" 
                        onClick={() => handleDownloadInvoice(invoice._id)}
                        title="Download Invoice"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="client-empty-state">
                <i className="fas fa-file-invoice"></i>
                <h3>No Invoices Yet</h3>
                <p>Your invoices will appear here once they are generated.</p>
              </div>
            )}
          </div>

          <div className="client-quick-actions">
            <h2>Quick Actions</h2>
            <div className="client-action-buttons">
              <button className="client-action-btn" onClick={handleViewAllInvoices}>
                <i className="fas fa-eye"></i>
                View All Invoices
              </button>
              <button className="client-action-btn" onClick={handleDownloadReports}>
                <i className="fas fa-download"></i>
                Download Reports
              </button>
              <button className="client-action-btn" onClick={handleContactSupport}>
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
