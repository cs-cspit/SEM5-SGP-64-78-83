import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context.jsx';
import AdminLayout from '../../Components/AdminLayout.jsx';
import Pagination from '../../Components/Pagination.jsx';
import { getAllContactSubmissions, replyToContact, getContactWithReplies } from '../../services/api.js';
import './QuoteForm.css';

const QuoteForm = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState({
        type: 'success', // 'success' or 'error'
        title: '',
        message: '',
        details: ''
    });
    const [replyData, setReplyData] = useState({
        subject: '',
        message: '',
        priority: 'normal'
    });

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
            const response = await getAllContactSubmissions();
            setQuotes(response.contacts || []);
            setError('');
        } catch (err) {
            console.error('Error fetching quotes:', err);
            setError('Failed to load quote forms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewQuote = async (quote) => {
        try {
            setLoading(true);
            console.log('Fetching quote details with replies...');

            // Fetch complete quote details with replies
            const response = await getContactWithReplies(quote._id || quote.id);
            console.log('Quote with replies:', response);

            setSelectedQuote(response.contact);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching quote details:', error);
            // Fallback to showing basic quote info if API fails
            setSelectedQuote(quote);
            setShowModal(true);
            setError('Could not load reply history. Showing basic quote information.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedQuote(null);
    };

    const handleReplyClick = (quote) => {
        setSelectedQuote(quote);
        setReplyData({
            subject: `Re: ${quote.subject || 'Your Inquiry'}`,
            message: `Dear ${quote.name},\n\nThank you for your inquiry regarding electrical services. \n\nBest regards,\nJay Jalaram Electricals Team`,
            priority: 'normal'
        });
        setShowReplyModal(true);
        setShowModal(false);
    };

    const closeReplyModal = () => {
        setShowReplyModal(false);
        setReplyData({
            subject: '',
            message: '',
            priority: 'normal'
        });
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (!replyData.subject.trim() || !replyData.message.trim()) {
            setError('Please fill in both subject and message fields.');
            return;
        }

        try {
            setLoading(true);
            console.log('Sending reply via API...');

            const response = await replyToContact(selectedQuote._id || selectedQuote.id, {
                subject: replyData.subject,
                message: replyData.message,
                priority: replyData.priority
            });

            console.log('Reply response:', response);

            // Refresh the selected quote with updated reply history
            try {
                const updatedQuoteResponse = await getContactWithReplies(selectedQuote._id || selectedQuote.id);
                setSelectedQuote(updatedQuoteResponse.contact);
            } catch (refreshError) {
                console.error('Error refreshing quote details:', refreshError);
            }

            // Close the reply modal
            closeReplyModal();

            // Show success message based on email result
            if (response.emailResult?.success) {
                setNotificationData({
                    type: 'success',
                    title: 'Reply Sent Successfully!',
                    message: `Your reply has been sent to ${selectedQuote.email}`,
                    details: `Message ID: ${response.emailResult.messageId || 'N/A'}`
                });
                setShowNotification(true);
            } else {
                setNotificationData({
                    type: 'warning',
                    title: 'Reply Saved with Warning',
                    message: 'The reply has been saved to the database, but email delivery failed.',
                    details: response.emailResult?.error || 'You may need to contact the client through alternative means.'
                });
                setShowNotification(true);
            }

        } catch (error) {
            console.error('Error sending reply:', error);
            setError(`Failed to send reply: ${error}`);
            setNotificationData({
                type: 'error',
                title: 'Failed to Send Reply',
                message: 'An error occurred while sending your reply.',
                details: 'Please check your internet connection and try again.'
            });
            setShowNotification(true);
        } finally {
            setLoading(false);
        }
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

    // Pagination calculations
    const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentQuotes = filteredQuotes.slice(startIndex, endIndex);

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
                        <div className="quote-stat-item">
                            <span className="stat-number">{quotes.length}</span>
                            <span className="stat-label">Total Quotes</span>
                        </div>
                        <div className="quote-stat-item">
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
                                {currentQuotes.length === 0 ? (
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
                                    currentQuotes.map((quote) => (
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
                                                    <button
                                                        className="action-btn reply-btn-small"
                                                        onClick={() => handleReplyClick(quote)}
                                                        title="Reply to Client"
                                                    >
                                                        <i className="fas fa-reply"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredQuotes.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredQuotes.length}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    )}
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

                                {/* Reply History Section */}
                                {selectedQuote.replies && selectedQuote.replies.length > 0 && (
                                    <div className="reply-history-section">
                                        <h4>
                                            <i className="fas fa-comments"></i>
                                            Reply History ({selectedQuote.replies.length})
                                        </h4>
                                        <div className="reply-timeline">
                                            {selectedQuote.replies.map((reply, index) => (
                                                <div key={reply.id || index} className="reply-item">
                                                    <div className="reply-header">
                                                        <div className="reply-meta">
                                                            <span className="admin-name">
                                                                <i className="fas fa-user-tie"></i>
                                                                {reply.adminName}
                                                            </span>
                                                            <span className="reply-date">
                                                                <i className="far fa-clock"></i>
                                                                {formatDate(reply.createdAt)}
                                                            </span>
                                                            <span className={`priority-badge priority-${reply.priority}`}>
                                                                <i className="fas fa-flag"></i>
                                                                {reply.priority.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="email-status">
                                                            {reply.emailSent ? (
                                                                <span className="email-success">
                                                                    <i className="fas fa-check-circle"></i>
                                                                    Delivered
                                                                </span>
                                                            ) : (
                                                                <span className="email-failed">
                                                                    <i className="fas fa-times-circle"></i>
                                                                    Failed
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="reply-content">
                                                        <div className="reply-subject">
                                                            <i className="fas fa-envelope"></i>
                                                            <strong>Subject:</strong> {reply.subject}
                                                        </div>
                                                        <div className="reply-message">
                                                            {reply.message}
                                                        </div>
                                                        {reply.emailError && (
                                                            <div className="email-error">
                                                                <i className="fas fa-exclamation-triangle"></i>
                                                                <strong>Error:</strong> {reply.emailError}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button
                                        className="action-btn reply-btn"
                                        onClick={() => handleReplyClick(selectedQuote)}
                                    >
                                        <i className="fas fa-reply"></i>
                                        Reply to Client
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reply Modal */}
                {showReplyModal && selectedQuote && (
                    <div className="modal-overlay" onClick={closeReplyModal}>
                        <div className="modal-content reply-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Reply to {selectedQuote.name}</h3>
                                <button className="close-btn" onClick={closeReplyModal}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <form onSubmit={handleReplySubmit} className="reply-form">
                                <div className="modal-body">
                                    <div className="client-context">
                                        <div className="context-item">
                                            <span className="context-label">To:</span>
                                            <span className="context-value">{selectedQuote.email}</span>
                                        </div>
                                        <div className="context-item">
                                            <span className="context-label">Company:</span>
                                            <span className="context-value">{selectedQuote.company || 'Individual'}</span>
                                        </div>
                                        <div className="context-item">
                                            <span className="context-label">Original Subject:</span>
                                            <span className="context-value">{selectedQuote.subject || 'General Inquiry'}</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="replySubject">Subject <span className="required">*</span></label>
                                        <input
                                            id="replySubject"
                                            type="text"
                                            value={replyData.subject}
                                            onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                                            placeholder="Enter email subject"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="replyPriority">Priority</label>
                                        <select
                                            id="replyPriority"
                                            value={replyData.priority}
                                            onChange={(e) => setReplyData({ ...replyData, priority: e.target.value })}
                                        >
                                            <option value="low">Low Priority</option>
                                            <option value="normal">Normal Priority</option>
                                            <option value="high">High Priority</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="replyMessage">Message <span className="required">*</span></label>
                                        <textarea
                                            id="replyMessage"
                                            value={replyData.message}
                                            onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                                            placeholder="Type your reply message here..."
                                            rows="8"
                                            required
                                        />
                                    </div>

                                    <div className="original-message">
                                        <h4>Original Message:</h4>
                                        <div className="original-content">
                                            {selectedQuote.message}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={closeReplyModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="send-reply-btn" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane"></i>
                                                Send Reply
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Success/Error Notification Modal */}
                {showNotification && (
                    <div className="notification-overlay" onClick={() => setShowNotification(false)}>
                        <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
                            <div className={`notification-header ${notificationData.type}`}>
                                <div className="notification-icon">
                                    {notificationData.type === 'success' && <i className="fas fa-check-circle"></i>}
                                    {notificationData.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
                                    {notificationData.type === 'error' && <i className="fas fa-times-circle"></i>}
                                </div>
                                <h3>{notificationData.title}</h3>
                            </div>
                            <div className="notification-body">
                                <p className="notification-message">{notificationData.message}</p>
                                {notificationData.details && (
                                    <p className="notification-details">{notificationData.details}</p>
                                )}
                            </div>
                            <div className="notification-footer">
                                <button
                                    className="notification-close-btn"
                                    onClick={() => setShowNotification(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default QuoteForm;
