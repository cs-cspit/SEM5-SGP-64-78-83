import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import AdminLayout from '../../Components/AdminLayout.jsx';
import { printInvoice } from '../../utils/invoiceGenerator.js';
import axios from 'axios';
import './InvoiceList.css';

const InvoiceList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin()) return;
    fetchInvoices();
  }, [isAdmin]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/bills', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      // Transform the bills data to match invoice format
      const transformedInvoices = response.data.data.map(bill => ({
        id: bill._id,
        invoiceNumber: `INV-${String(bill.invoiceNo).padStart(3, '0')}`,
        client: bill.clientName,
        amount: bill.totalAmount,
        status: getRandomStatus(), // Since we don't have status in bills, generate random for demo
        dueDate: new Date(bill.date).toLocaleDateString('en-GB'),
        createdDate: new Date(bill.createdAt).toLocaleDateString('en-GB'),
        ...bill
      }));

      setInvoices(transformedInvoices);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices');
      setLoading(false);
    }
  };

  // Helper function to generate random status for demo purposes
  const getRandomStatus = () => {
    const statuses = ['paid', 'pending', 'overdue', 'draft'];
    const weights = [0.4, 0.3, 0.2, 0.1]; // Higher probability for paid/pending
    const random = Math.random();
    let weightSum = 0;

    for (let i = 0; i < statuses.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) {
        return statuses[i];
      }
    }
    return 'paid';
  };

  const handleEditInvoice = (invoiceId) => {
    navigate(`/admin/bill/edit/${invoiceId}`);
  };

  const handleViewInvoice = (invoice) => {
    // Prepare invoice data for generation
    const invoiceData = {
      invoiceNumber: `INV-${String(invoice.invoiceNo).padStart(3, '0')}`,
      date: invoice.date,
      companyName: invoice.companyName || invoice.clientName,
      companyAddress: invoice.companyAddress || invoice.address,
      siteLocation: invoice.siteLocation,
      gstNumber: invoice.gstNumber,
      totalAmount: invoice.totalAmount,
      items: invoice.items,
      workDescription: invoice.workDescription
    };

    // Generate and print invoice
    printInvoice(invoiceData);
  };

  const getInvoiceStatus = (invoice) => {
    const currentDate = new Date();
    const dueDate = invoice.paymentDueDate
      ? new Date(invoice.paymentDueDate)
      : (() => {
        const fallbackDate = new Date(invoice.date);
        fallbackDate.setDate(fallbackDate.getDate() + 30);
        return fallbackDate;
      })();

    // For demo purposes, still use random but bias based on due date
    const daysPastDue = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));

    if (daysPastDue > 0) {
      // Past due - higher chance of overdue status
      const statuses = ['paid', 'overdue', 'pending'];
      const weights = [0.3, 0.5, 0.2];
      const random = Math.random();
      let weightSum = 0;

      for (let i = 0; i < statuses.length; i++) {
        weightSum += weights[i];
        if (random <= weightSum) {
          return statuses[i];
        }
      }
      return 'overdue';
    } else {
      // Not past due - lower chance of overdue
      return getRandomStatus();
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'status-paid';
      case 'pending':
        return 'status-pending';
      case 'overdue':
        return 'status-overdue';
      case 'draft':
        return 'status-draft';
      case 'sent':
        return 'status-sent';
      case 'viewed':
        return 'status-viewed';
      case 'partially_paid':
        return 'status-partially-paid';
      case 'cancelled':
        return 'status-cancelled';
      case 'refunded':
        return 'status-refunded';
      default:
        return 'status-pending';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(invoice.invoiceNo).includes(searchTerm);

    if (statusFilter === 'All Status') {
      return matchesSearch;
    }

    // Use actual status from database, fallback to random for older bills without status
    const actualStatus = invoice.status || getRandomStatus();
    const matchesStatus = actualStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="invoice-list-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading invoices...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="invoice-list-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Invoices</h1>
            <p>Manage your invoices and billing</p>
          </div>
          <button
            onClick={() => navigate('/admin/bill')}
            className="create-invoice-button"
          >
            <span className="button-icon">+</span>
            Create Invoice
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠</span>
            {error}
          </div>
        )}

        <div className="invoice-management-card">
          <div className="card-header">
            <h3>Invoice Management</h3>
            <div className="header-controls">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="All Status">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Sent">Sent</option>
                <option value="Viewed">Viewed</option>
                <option value="Paid">Paid</option>
                <option value="Partially_paid">Partially Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="invoice-table-container">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map(invoice => {
                    // Use actual status from database, fallback to intelligent status for older bills
                    const actualStatus = invoice.status || getInvoiceStatus(invoice);
                    // Use the actual paymentDueDate from the bill, or calculate if not available (for backward compatibility)
                    const dueDate = invoice.paymentDueDate
                      ? new Date(invoice.paymentDueDate)
                      : (() => {
                        const fallbackDate = new Date(invoice.date);
                        fallbackDate.setDate(fallbackDate.getDate() + 30);
                        return fallbackDate;
                      })();

                    return (
                      <tr key={invoice._id}>
                        <td>
                          <div className="invoice-number">
                            INV-{String(invoice.invoiceNo).padStart(4, '0')}
                          </div>
                        </td>
                        <td>
                          <div className="client-info">
                            <div className="client-name">{invoice.clientName}</div>
                          </div>
                        </td>
                        <td>
                          <div className="amount">
                            {formatCurrency(invoice.totalAmount)}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusClass(actualStatus)}`}>
                            {actualStatus}
                          </span>
                        </td>
                        <td>
                          <div className="date">
                            {dueDate.toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="date">
                            {new Date(invoice.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="action-button view"
                              onClick={() => handleViewInvoice(invoice)}
                              title="View Invoice"
                            >
                              👁️
                            </button>
                            <button
                              className="action-button edit"
                              onClick={() => handleEditInvoice(invoice._id)}
                              title="Edit Invoice"
                            >
                              ✏️
                            </button>
                            <button
                              className="action-button more"
                              onClick={() => console.log('More options:', invoice._id)}
                              title="More Options"
                            >
                              ⋯
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      <div className="no-invoices">
                        <div className="no-invoices-icon">📄</div>
                        <h3>No invoices found</h3>
                        <p>
                          {searchTerm || statusFilter !== 'All Status'
                            ? 'No invoices match your search criteria'
                            : 'Get started by creating your first invoice'
                          }
                        </p>
                        {!searchTerm && statusFilter === 'All Status' && (
                          <button
                            onClick={() => navigate('/admin/bill')}
                            className="create-first-invoice"
                          >
                            Create Your First Invoice
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InvoiceList;
