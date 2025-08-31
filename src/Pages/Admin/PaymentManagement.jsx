import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import AdminLayout from '../../Components/AdminLayout.jsx';
import { getAllBills, updateBillStatus } from '../../services/api.js';
import './PaymentManagement.css';

const PaymentManagement = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [pendingChanges, setPendingChanges] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [paymentStats, setPaymentStats] = useState({
        totalPaid: 0,
        pendingPayments: 0,
        overdueAmount: 0,
        collectionRate: 0
    });

    // Redirect if not admin
    React.useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        fetchBills();
    }, []);

    useEffect(() => {
        filterAndSearchBills();
    }, [bills, searchTerm, statusFilter]);

    // Auto-clear messages after 5 seconds
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);

    const fetchBills = async () => {
        try {
            setLoading(true);
            const response = await getAllBills();
            const billsData = response.bills || [];
            setBills(billsData);
            calculatePaymentStats(billsData);
        } catch (error) {
            console.error('Error fetching bills:', error);
            setError('Failed to fetch payment data');
        } finally {
            setLoading(false);
        }
    };

    const calculatePaymentStats = (billsData) => {
        const currentDate = new Date();

        let totalPaid = 0;
        let pendingPayments = 0;
        let overdueAmount = 0;
        let totalAmount = 0;

        billsData.forEach(bill => {
            const billTotal = bill.totalAmount || 0;
            totalAmount += billTotal;

            if (bill.status === 'paid') {
                totalPaid += billTotal;
            } else if (bill.status === 'pending') {
                pendingPayments += billTotal;

                // Check if overdue
                const dueDate = new Date(bill.paymentDueDate);
                if (dueDate < currentDate) {
                    overdueAmount += billTotal;
                }
            }
        });

        const collectionRate = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

        setPaymentStats({
            totalPaid,
            pendingPayments,
            overdueAmount,
            collectionRate
        });
    };

    const filterAndSearchBills = () => {
        let filtered = [...bills];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(bill => bill.status === statusFilter);
        }

        // Search by client name, invoice ID, or payment method
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(bill =>
                bill.companyName?.toLowerCase().includes(term) ||
                formatInvoiceNumber(bill.invoiceNo)?.toLowerCase().includes(term) ||
                bill.clientName?.toLowerCase().includes(term) ||
                formatPaymentId(bill.invoiceNo)?.toLowerCase().includes(term)
            );
        }

        setFilteredBills(filtered);
    };

    const handleStatusChange = (billId, newStatus, clientName) => {
        setError('');
        setSuccessMessage('');

        // Store pending changes instead of immediately saving
        setPendingChanges(prev => ({
            ...prev,
            [billId]: {
                newStatus,
                clientName,
                originalStatus: bills.find(bill => bill._id === billId)?.status
            }
        }));

        setHasUnsavedChanges(true);
    };

    const saveAllChanges = async () => {
        try {
            setError('');
            setSuccessMessage('');

            const changeCount = Object.keys(pendingChanges).length;
            if (changeCount === 0) {
                setError('No changes to save');
                return;
            }

            // Save all pending changes
            const updatePromises = Object.entries(pendingChanges).map(([billId, change]) =>
                updateBillStatus(billId, change.newStatus)
            );

            await Promise.all(updatePromises);

            // Update local state with all changes
            const updatedBills = bills.map(bill => {
                if (pendingChanges[bill._id]) {
                    return { ...bill, status: pendingChanges[bill._id].newStatus };
                }
                return bill;
            });

            setBills(updatedBills);
            calculatePaymentStats(updatedBills);

            // Clear pending changes
            setPendingChanges({});
            setHasUnsavedChanges(false);

            // Show success notification
            setSuccessMessage(`Successfully updated ${changeCount} payment status${changeCount > 1 ? 'es' : ''}`);

        } catch (error) {
            console.error('Error saving changes:', error);
            setError(error.response?.data?.message || 'Failed to save payment status changes');
        }
    };

    const cancelChanges = () => {
        setPendingChanges({});
        setHasUnsavedChanges(false);
        setError('');
        setSuccessMessage('');
    };

    const getCurrentStatus = (billId) => {
        if (pendingChanges[billId]) {
            return pendingChanges[billId].newStatus;
        }
        const bill = bills.find(b => b._id === billId);
        return bill?.status || 'pending';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatInvoiceNumber = (invoiceNo) => {
        if (!invoiceNo) return '-';
        return `INV-${String(invoiceNo).padStart(3, '0')}`;
    };

    const formatPaymentId = (invoiceNo, index) => {
        if (invoiceNo) {
            return `PAY-${String(invoiceNo).padStart(3, '0')}`;
        }
        return `PAY-${String(index + 1).padStart(3, '0')}`;
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'paid':
                return 'status-completed';
            case 'pending':
                return 'status-pending';
            case 'overdue':
                return 'status-overdue';
            case 'partially_paid':
                return 'status-partial';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    };

    const exportToCSV = () => {
        const headers = ['Payment ID', 'Invoice ID', 'Client', 'Amount', 'Date', 'Due Date', 'Status'];
        const csvData = [
            headers,
            ...filteredBills.map((bill, index) => [
                formatPaymentId(bill.invoiceNo, index),
                formatInvoiceNumber(bill.invoiceNo),
                bill.companyName || bill.clientName || '-',
                bill.totalAmount || 0,
                formatDate(bill.date),
                formatDate(bill.paymentDueDate),
                bill.status || 'pending'
            ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (!isAdmin()) {
        return null;
    }

    return (
        <AdminLayout>
            <div className="payment-management">
                <div className="payment-header">
                    <div className="header-content">
                        <h2>Payments</h2>
                        <p className="header-subtitle">Track and manage payment records</p>
                    </div>
                    <button className="record-payment-btn" onClick={() => navigate('/admin/bill')}>
                        <span className="btn-icon">+</span>
                        Record Payment
                    </button>
                </div>

                {/* Success and Error Messages */}
                {successMessage && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✓</span>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">⚠</span>
                        {error}
                    </div>
                )}

                {/* Payment Stats Cards */}
                <div className="payment-stats-grid">
                    <div className="stat-card total-paid">
                        <div className="stat-icon">✓</div>
                        <div className="stat-content">
                            <h3>Total Paid</h3>
                            <div className="stat-value">{formatCurrency(paymentStats.totalPaid)}</div>
                            <div className="stat-subtitle">This month</div>
                        </div>
                    </div>

                    <div className="stat-card pending-payments">
                        <div className="stat-icon">$</div>
                        <div className="stat-content">
                            <h3>Pending Payments</h3>
                            <div className="stat-value">{formatCurrency(paymentStats.pendingPayments)}</div>
                            <div className="stat-subtitle">Awaiting payment</div>
                        </div>
                    </div>

                    <div className="stat-card overdue-amount">
                        <div className="stat-icon">⚠</div>
                        <div className="stat-content">
                            <h3>Overdue Amount</h3>
                            <div className="stat-value">{formatCurrency(paymentStats.overdueAmount)}</div>
                            <div className="stat-subtitle">Past due date</div>
                        </div>
                    </div>

                    <div className="stat-card collection-rate">
                        <div className="stat-icon">📈</div>
                        <div className="stat-content">
                            <h3>Collection Rate</h3>
                            <div className="stat-value">{paymentStats.collectionRate}%</div>
                            <div className="stat-subtitle">+5% from last month</div>
                        </div>
                    </div>
                </div>

                {/* Save/Cancel Changes Section */}
                {hasUnsavedChanges && (
                    <div className="unsaved-changes-section">
                        <div className="changes-info">
                            <span className="changes-icon">⚠️</span>
                            <div className="changes-text">
                                <strong>You have {Object.keys(pendingChanges).length} unsaved changes</strong>
                                <p>Click "Save Changes" to apply or "Cancel" to discard changes</p>
                            </div>
                        </div>
                        <div className="changes-actions">
                            <button className="cancel-btn" onClick={cancelChanges}>
                                Cancel Changes
                            </button>
                            <button className="save-btn" onClick={saveAllChanges}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* Payment History Section */}
                <div className="payment-history-section">
                    <div className="section-header">
                        <h3>Payment History</h3>
                        <button className="export-btn" onClick={exportToCSV}>
                            <span className="btn-icon">⬇</span>
                            Export CSV
                        </button>
                    </div>

                    <div className="filters-row">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search payments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="status-filter">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="status-select"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="partially_paid">Partially Paid</option>
                                <option value="overdue">Overdue</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Payment Table */}
                    <div className="payment-table-container">
                        {loading ? (
                            <div className="loading-state">Loading payments...</div>
                        ) : (
                            <table className="payment-table">
                                <thead>
                                    <tr>
                                        <th>Payment ID</th>
                                        <th>Invoice ID</th>
                                        <th>Client</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Due Date</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBills.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="no-data">
                                                {searchTerm || statusFilter !== 'all'
                                                    ? 'No payments found matching your criteria.'
                                                    : 'No payments recorded yet.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBills.map((bill, index) => (
                                            <tr key={bill._id}>
                                                <td>{formatPaymentId(bill.invoiceNo, index)}</td>
                                                <td>{formatInvoiceNumber(bill.invoiceNo)}</td>
                                                <td>{bill.companyName || bill.clientName || '-'}</td>
                                                <td>{formatCurrency(bill.totalAmount)}</td>
                                                <td>{formatDate(bill.date)}</td>
                                                <td>{formatDate(bill.paymentDueDate)}</td>
                                                <td>
                                                    <span className="payment-method">
                                                        {bill.status === 'paid' ? 'Bank Transfer' : '-'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${getStatusBadgeClass(getCurrentStatus(bill._id))}`}>
                                                        {getCurrentStatus(bill._id) || 'pending'}
                                                        {pendingChanges[bill._id] && <span className="pending-indicator">*</span>}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={getCurrentStatus(bill._id)}
                                                        onChange={(e) => handleStatusChange(bill._id, e.target.value, bill.companyName || bill.clientName)}
                                                        className={`status-dropdown ${pendingChanges[bill._id] ? 'has-pending-change' : ''}`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="overdue">Overdue</option>
                                                        <option value="partially_paid">Partially Paid</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PaymentManagement;
