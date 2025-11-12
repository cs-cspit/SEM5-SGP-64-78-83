import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import AdminLayout from '../../Components/AdminLayout.jsx';
import Pagination from '../../Components/Pagination.jsx';
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
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

    const fetchBills = async () => {
        try {
            setLoading(true);
            const response = await getAllBills();
            const billsData = response.bills || [];
            setBills(billsData);
            calculatePaymentStats(billsData);
        } catch (error) {
            console.error('Error fetching bills:', error);
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

    const handleStatusChange = async (billId, newStatus) => {
        try {
            await updateBillStatus(billId, newStatus);

            // Update local state
            const updatedBills = bills.map(bill =>
                bill._id === billId ? { ...bill, status: newStatus } : bill
            );
            setBills(updatedBills);
            calculatePaymentStats(updatedBills);

            // Show success message (you can add a toast notification here)
            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            // Show error message (you can add a toast notification here)
        }
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

    // Pagination calculations
    const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBills = filteredBills.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    if (!isAdmin()) {
        return null;
    }

    return (
        <AdminLayout>
            <div className="payment-management">
                <div className="page-header">
                    <div className="header-content">
                        <h1>Payments</h1>
                        <p>Track and manage payment records</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/bill')}
                        className="create-payment-button"
                    >
                        <span className="button-icon">+</span>
                        Create Payment
                    </button>
                </div>

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
                        <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
                        <div className="stat-content">
                            <h3>Overdue Amount</h3>
                            <div className="stat-value">{formatCurrency(paymentStats.overdueAmount)}</div>
                            <div className="stat-subtitle">Past due date</div>
                        </div>
                    </div>

                    <div className="stat-card collection-rate">
                        <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
                        <div className="stat-content">
                            <h3>Collection Rate</h3>
                            <div className="stat-value">{paymentStats.collectionRate}%</div>
                            <div className="stat-subtitle">+5% from last month</div>
                        </div>
                    </div>
                </div>

                {/* Payment Management Card */}
                <div className="payment-management-card">
                    <div className="card-header">
                        <h3>Payment Management</h3>
                        <div className="header-controls">
                            <div className="search-box">
                                <span className="search-icon"><i className="fas fa-search"></i></span>
                                <input
                                    type="text"
                                    placeholder="Search payments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="status-filter"
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
                                        {/* <th>Method</th> */}
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBills.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="no-data">
                                                {searchTerm || statusFilter !== 'all'
                                                    ? 'No payments found matching your criteria.'
                                                    : 'No payments recorded yet.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        currentBills.map((bill, index) => (
                                            <tr key={bill._id}>
                                                <td>{formatPaymentId(bill.invoiceNo, index)}</td>
                                                <td>{formatInvoiceNumber(bill.invoiceNo)}</td>
                                                <td>{bill.companyName || bill.clientName || '-'}</td>
                                                <td>{formatCurrency(bill.totalAmount)}</td>
                                                <td>{formatDate(bill.date)}</td>
                                                <td>{formatDate(bill.paymentDueDate)}</td>
                                                {/* <td>
                                                    <span className="payment-method">
                                                        {bill.status === 'paid' ? 'Bank Transfer' : '-'}
                                                    </span>
                                                </td> */}
                                                <td>
                                                    <span className={`status-badge ${getStatusBadgeClass(bill.status)}`}>
                                                        {bill.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={bill.status || 'pending'}
                                                        onChange={(e) => handleStatusChange(bill._id, e.target.value)}
                                                        className="status-dropdown"
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

                    {/* Pagination */}
                    {filteredBills.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredBills.length}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default PaymentManagement;
