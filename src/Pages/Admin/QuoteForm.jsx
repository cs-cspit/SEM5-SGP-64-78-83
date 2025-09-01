import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import AdminLayout from '../../Components/AdminLayout.jsx';
import axios from 'axios';
import './QuoteForm.css';

const QuoteForm = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Redirect if not admin
    React.useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        if (!isAdmin()) return;
        fetchQuotes();
    }, [isAdmin]);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/contact/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            setQuotes(response.data.contacts || []);
            setError('');
        } catch (err) {
            console.error('Error fetching quotes:', err);
            setError('Failed to load quote forms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (quoteId, newStatus) => {
        try {
            console.log('Updating quote status:', quoteId, newStatus);

            const response = await axios.patch(`http://localhost:5000/api/contact/${quoteId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );

            console.log('Status update response:', response.data);

            // Update local state
            setQuotes(quotes.map(quote =>
                (quote._id || quote.id) === quoteId ? { ...quote, status: newStatus } : quote
            ));

            setSelectedQuote(prev => (prev?._id || prev?.id) === quoteId ? { ...prev, status: newStatus } : prev);

            // Clear any previous errors
            setError('');
        } catch (err) {
            console.error('Error updating status:', err);
            console.error('Error response:', err.response?.data);
            setError('Failed to update status. Please try again.');
        }
    };

    const handleViewQuote = (quote) => {
        setSelectedQuote(quote);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedQuote(null);
    };

    const filteredQuotes = quotes.filter(quote => {
        const matchesSearch =
            quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.subject?.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'All Status') {
            return matchesSearch;
        }

        return matchesSearch && quote.status.toLowerCase() === statusFilter.toLowerCase();
    });

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'status-pending',
            read: 'status-read',
            replied: 'status-replied',
            resolved: 'status-resolved'
        };

        return (
            <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isAdmin()) {
        return null;
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="quote-form-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading quote forms...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="quote-form-container">
                <div className="page-header">
                    <div className="header-content">
                        <h1>Quote Forms</h1>
                        <p>Manage submitted quote requests and inquiries</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-number">{quotes.length}</span>
                            <span className="stat-label">Total Quotes</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{quotes.filter(q => q.status === 'pending').length}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon"><i className="fas fa-exclamation-triangle"></i></span>
                        {error}
                    </div>
                )}

                <div className="quote-management-card">
                    <div className="card-header">
                        <h3>Quote Request Management</h3>
                        <div className="header-controls">
                            <div className="search-box">
                                <span className="search-icon"><i className="fas fa-search"></i></span>
                                <input
                                    type="text"
                                    placeholder="Search quotes..."
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
                                <option value="pending">Pending</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="quote-table">
                            <thead>
                                <tr>
                                    <th>Quote ID</th>
                                    <th>Client Details</th>
                                    <th>Company</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuotes.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="no-data">
                                            <div className="no-data-content">
                                                <i className="fas fa-file-text"></i>
                                                <h4>No Quote Forms Found</h4>
                                                <p>There are no quote forms matching your search criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredQuotes.map((quote) => (
                                        <tr key={quote._id || quote.id}>
                                            <td>
                                                <span className="quote-id">QT-{String(quote._id || quote.id).slice(-6).toUpperCase()}</span>
                                            </td>
                                            <td>
                                                <div className="client-info">
                                                    <span className="client-name">{quote.name}</span>
                                                    <span className="client-email">{quote.email}</span>
                                                    <span className="client-phone">{quote.phone || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="company-name">{quote.company || 'Individual'}</span>
                                            </td>
                                            <td>
                                                <span className="quote-subject">{quote.subject || 'General Inquiry'}</span>
                                            </td>
                                            <td>
                                                {getStatusBadge(quote.status)}
                                            </td>
                                            <td>
                                                <span className="quote-date">{formatDate(quote.createdAt)}</span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn view-btn"
                                                        onClick={() => handleViewQuote(quote)}
                                                        title="View Quote Details"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <select
                                                        className="status-select"
                                                        value={quote.status}
                                                        onChange={(e) => handleStatusUpdate(quote._id || quote.id, e.target.value)}
                                                        title="Update Status"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="read">Read</option>
                                                        <option value="replied">Replied</option>
                                                        <option value="resolved">Resolved</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quote Details Modal */}
                {showModal && selectedQuote && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Quote Details - QT-{String(selectedQuote._id || selectedQuote.id).slice(-6).toUpperCase()}</h3>
                                <button className="close-btn" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="quote-details-grid">
                                    <div className="detail-section">
                                        <h4>Client Information</h4>
                                        <div className="detail-row">
                                            <span className="label">Name:</span>
                                            <span className="value">{selectedQuote.name}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Email:</span>
                                            <span className="value">{selectedQuote.email}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Phone:</span>
                                            <span className="value">{selectedQuote.phone || 'Not provided'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Company:</span>
                                            <span className="value">{selectedQuote.company || 'Individual'}</span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Quote Information</h4>
                                        <div className="detail-row">
                                            <span className="label">Subject:</span>
                                            <span className="value">{selectedQuote.subject || 'General Inquiry'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Status:</span>
                                            <span className="value">{getStatusBadge(selectedQuote.status)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Submitted:</span>
                                            <span className="value">{formatDate(selectedQuote.createdAt)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Last Updated:</span>
                                            <span className="value">{formatDate(selectedQuote.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="message-section">
                                    <h4>Message/Requirements</h4>
                                    <div className="message-content">
                                        {selectedQuote.message}
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <select
                                        className="status-update-select"
                                        value={selectedQuote.status}
                                        onChange={(e) => handleStatusUpdate(selectedQuote._id || selectedQuote.id, e.target.value)}
                                    >
                                        <option value="pending">Mark as Pending</option>
                                        <option value="read">Mark as Read</option>
                                        <option value="replied">Mark as Replied</option>
                                        <option value="resolved">Mark as Resolved</option>
                                    </select>
                                    <button className="action-btn reply-btn">
                                        <i className="fas fa-reply"></i>
                                        Reply to Client
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default QuoteForm;
