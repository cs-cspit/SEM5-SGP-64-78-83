import React from 'react';
import './Pagination.css';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems,
    onItemsPerPageChange
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        if (page !== '...' && page !== currentPage) {
            onPageChange(page);
        }
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                <span className="pagination-text">
                    Showing <span className="pagination-highlight">{startItem}</span> to{' '}
                    <span className="pagination-highlight">{endItem}</span> of{' '}
                    <span className="pagination-highlight">{totalItems}</span> entries
                </span>

                {onItemsPerPageChange && (
                    <div className="items-per-page">
                        <label htmlFor="itemsPerPage">Show:</label>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            className="items-per-page-select"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="pagination-controls">
                <button
                    className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    <i className="fas fa-chevron-left"></i>
                    <span>Previous</span>
                </button>

                <div className="pagination-numbers">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            className={`pagination-number ${page === currentPage ? 'active' : ''
                                } ${page === '...' ? 'ellipsis' : ''}`}
                            onClick={() => handlePageClick(page)}
                            disabled={page === '...'}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className={`pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    <span>Next</span>
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
