import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBill, getNextInvoiceNumber, getAllClients, getBillById, updateBill } from '../../services/api';
import AdminLayout from '../../Components/AdminLayout.jsx';
import './BillGeneration.css';

const BillGeneration = () => {
    const navigate = useNavigate();
    const { billId } = useParams();
    const isEditMode = Boolean(billId);
    
    const [loading, setLoading] = useState(false);
    const [nextInvoiceNo, setNextInvoiceNo] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [editingBill, setEditingBill] = useState(null);
    
    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        workingSite: '',
        clientName: '',
        orderNumber: '',
        date: new Date().toISOString().split('T')[0],
        paymentDueDate: '',
        companyGst: '',
        status: 'pending', // Default status
        products: []
    });

    const [productDraft, setProductDraft] = useState({
        productName: '',
        quantity: 1,
        hsn: '',
        rate: 0,
        gstRate: 9,
        discountRate: 0
    });

    useEffect(() => {
        if (isEditMode && billId) {
            // Load bill data for editing
            loadBillForEdit();
        } else {
            // Create mode - get next invoice number
            fetchNextInvoiceNumber();
        }
        
        fetchClients();
        
        // Set default due date to 30 days from today (only for create mode)
        if (!isEditMode) {
            const today = new Date();
            const defaultDueDate = new Date(today);
            defaultDueDate.setDate(defaultDueDate.getDate() + 30);
            
            setFormData(prev => ({
                ...prev,
                paymentDueDate: defaultDueDate.toISOString().split('T')[0]
            }));
        }
    }, [billId, isEditMode]);

    const fetchNextInvoiceNumber = async () => {
        try {
            const response = await getNextInvoiceNumber();
            setNextInvoiceNo(response.nextInvoiceNo);
        } catch (error) {
            console.error('Error fetching next invoice number:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await getAllClients();
            setClients(response.data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const loadBillForEdit = async () => {
        try {
            setLoading(true);
            const response = await getBillById(billId);
            const bill = response.data;
            setEditingBill(bill);

            // Pre-fill the form with bill data
            setFormData({
                companyName: bill.companyName || '',
                address: bill.address || '',
                workingSite: bill.workingSite || '',
                clientName: bill.clientName || '',
                orderNumber: bill.orderNumber || '',
                date: bill.date ? new Date(bill.date).toISOString().split('T')[0] : '',
                paymentDueDate: bill.paymentDueDate ? new Date(bill.paymentDueDate).toISOString().split('T')[0] : '',
                companyGst: bill.companyGst || '',
                status: bill.status || 'pending',
                products: bill.products || []
            });

            setLoading(false);
        } catch (error) {
            console.error('Error loading bill for edit:', error);
            setLoading(false);
            // Navigate back to invoice list if bill not found
            navigate('/admin/invoices');
        }
    };

    // Effect to handle client selection after clients are loaded in edit mode
    useEffect(() => {
        if (isEditMode && editingBill && clients.length > 0) {
            const matchingClient = clients.find(client => 
                client.companyName === editingBill.companyName && 
                client.gstNumber === editingBill.companyGst
            );
            if (matchingClient) {
                setSelectedClient(matchingClient);
            }
        }
    }, [clients, editingBill, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // If changing the invoice date, automatically set due date to 30 days later
        if (name === 'date' && value) {
            const invoiceDate = new Date(value);
            const dueDate = new Date(invoiceDate);
            dueDate.setDate(dueDate.getDate() + 30);
            
            setFormData(prev => ({
                ...prev,
                [name]: value,
                paymentDueDate: dueDate.toISOString().split('T')[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleClientSelect = (e) => {
        const clientId = e.target.value;
        if (clientId === '') {
            // Clear form when "Select Client" is chosen
            setSelectedClient(null);
            setFormData(prev => ({
                ...prev,
                companyName: '',
                address: '',
                clientName: '',
                companyGst: ''
            }));
            return;
        }

        const client = clients.find(c => c._id === clientId);
        if (client) {
            setSelectedClient(client);
            
            // Calculate default due date (30 days from invoice date)
            let defaultDueDate = '';
            if (formData.date) {
                const invoiceDate = new Date(formData.date);
                const dueDate = new Date(invoiceDate);
                dueDate.setDate(dueDate.getDate() + 30);
                defaultDueDate = dueDate.toISOString().split('T')[0];
            }
            
            setFormData(prev => ({
                ...prev,
                companyName: client.companyName,
                address: client.address,
                clientName: client.contactPerson || client.companyName,
                companyGst: client.gstNumber,
                paymentDueDate: defaultDueDate || prev.paymentDueDate
            }));
        }
    };

    const handleDraftChange = (e) => {
        const { name, value } = e.target;
        setProductDraft(prev => ({
            ...prev,
            [name]: name === 'gstRate' || name === 'rate' || name === 'quantity' || name === 'discountRate' 
                ? parseFloat(value) || 0 
                : value
        }));
    };

    const addProduct = () => {
        // Compute derived amounts for current draft
        const basicAmount = (productDraft.quantity || 0) * (productDraft.rate || 0);
        const discountAmount = basicAmount * ((productDraft.discountRate || 0) / 100);
        const amountAfterDiscount = basicAmount - discountAmount;
        const cgstAmount = amountAfterDiscount * ((productDraft.gstRate || 0) / 100);
        const sgstAmount = amountAfterDiscount * ((productDraft.gstRate || 0) / 100);

        const finalized = {
            ...productDraft,
            basicAmount: amountAfterDiscount,
            cgst: cgstAmount,
            sgst: sgstAmount,
            total: amountAfterDiscount + cgstAmount + sgstAmount
        };

        setFormData(prev => ({
            ...prev,
            products: [...prev.products, finalized]
        }));

        // Clear draft for next product
        setProductDraft({
            productName: '',
            quantity: 1,
            hsn: '',
            rate: 0,
            gstRate: 9,
            discountRate: 0
        });
    };

    const removeProduct = (index) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }));
    };

    const calculateTotals = () => {
        const totals = formData.products.reduce((acc, product) => {
            return {
                totalCgst: acc.totalCgst + (product.cgst || 0),
                totalSgst: acc.totalSgst + (product.sgst || 0),
                netAmount: acc.netAmount + (product.basicAmount || 0),
                totalAmount: acc.totalAmount + (product.total || 0)
            };
        }, { totalCgst: 0, totalSgst: 0, netAmount: 0, totalAmount: 0 });

        return totals;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const totals = calculateTotals();
            const billData = {
                ...formData,
                ...totals
            };

            if (isEditMode) {
                // Update existing bill
                await updateBill(billId, billData);
                navigate('/admin/invoices');
            } else {
                // Create new bill with default pending status
                billData.status = 'pending';
                await createBill(billData);
                navigate('/admin/invoices');
            }
        } catch (error) {
            console.error('Error saving bill:', error);
        } finally {
            setLoading(false);
        }
    };

    const gstRates = [2.5, 6, 9, 12, 18];

    return (
        <AdminLayout>
            <div className="bill-generation-container">
                <h2>{isEditMode ? 'Edit Invoice' : 'Generate New Invoice'}</h2>
                {isEditMode && editingBill && (
                    <div className="edit-mode-indicator">
                        <span className="edit-badge">Editing Invoice #{editingBill.invoiceNo}</span>
                    </div>
                )}
                
                {loading && isEditMode ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading invoice data...</p>
                    </div>
                ) : (
                <div className="bill-form">
                    <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Select Client</label>
                            <select
                                onChange={handleClientSelect}
                                value={selectedClient?._id || ''}
                                className="client-select"
                                required
                            >
                                <option value="">Select a client</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>
                                        {client.companyName} - {client.gstNumber}
                                    </option>
                                ))}
                            </select>
                            {selectedClient && (
                                <div className="client-info-badge">
                                    ✓ Client selected: {selectedClient.companyName}
                                    <button
                                        type="button"
                                        onClick={() => handleClientSelect({ target: { value: '' } })}
                                        className="clear-client-btn"
                                        title="Clear client selection"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Auto-filled from client selection"
                                disabled={selectedClient !== null}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Auto-filled from client selection"
                                disabled={selectedClient !== null}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Working Site</label>
                            <input
                                type="text"
                                name="workingSite"
                                value={formData.workingSite}
                                onChange={handleInputChange}
                                placeholder="Enter working site location"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Invoice No (Auto Generated)</label>
                            <input
                                type="number"
                                value={nextInvoiceNo || ''}
                                placeholder="Auto-generated"
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Client Name</label>
                            <input
                                type="text"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                placeholder="Auto-filled from client selection"
                                disabled={selectedClient !== null}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Order Number</label>
                            <input
                                type="text"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleInputChange}
                                placeholder="Enter order number"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Payment Due Date</label>
                            <input
                                type="date"
                                name="paymentDueDate"
                                value={formData.paymentDueDate}
                                onChange={handleInputChange}
                                min={formData.date}
                                placeholder="Select payment due date"
                                required
                            />
                            {formData.paymentDueDate && formData.date && (
                                <div className="due-date-info">
                                    {(() => {
                                        const invoiceDate = new Date(formData.date);
                                        const dueDate = new Date(formData.paymentDueDate);
                                        const daysDiff = Math.ceil((dueDate - invoiceDate) / (1000 * 60 * 60 * 24));
                                        
                                        // if (daysDiff < 0) {
                                        //     return <span className="date-warning">⚠️ Due date is before invoice date</span>;
                                        // } else if (daysDiff === 0) {
                                        //     return <span className="date-warning">⚠️ Payment due same day as invoice</span>;
                                        // } else if (daysDiff <= 7) {
                                        //     return <span className="date-info">📅 Payment due in {daysDiff} day{daysDiff > 1 ? 's' : ''}</span>;
                                        // } else if (daysDiff <= 30) {
                                        //     return <span className="date-info">📅 Payment due in {daysDiff} days</span>;
                                        // } else if (daysDiff <= 60) {
                                        //     return <span className="date-success">✅ Payment due in {daysDiff} days (Extended terms)</span>;
                                        // } else {
                                        //     return <span className="date-warning">⚠️ Payment due in {daysDiff} days (Very long terms)</span>;
                                        // }
                                    })()}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Company GST Number</label>
                            <input
                                type="text"
                                name="companyGst"
                                value={formData.companyGst}
                                onChange={handleInputChange}
                                placeholder="Auto-filled from client selection"
                                disabled={selectedClient !== null}
                                required
                            />
                        </div>
                    </div>

                    <div className="products-section">
                        <h3>Product Entry</h3>
                        <div className="product-entry">
                            <div className="product-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={productDraft.productName}
                                        onChange={handleDraftChange}
                                        placeholder="Enter product name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={productDraft.quantity}
                                        onChange={handleDraftChange}
                                        min="1"
                                        placeholder="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>HSN Code</label>
                                    <input
                                        type="text"
                                        name="hsn"
                                        value={productDraft.hsn}
                                        onChange={handleDraftChange}
                                        placeholder="Enter HSN code"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rate (₹)</label>
                                    <input
                                        type="number"
                                        name="rate"
                                        value={productDraft.rate}
                                        onChange={handleDraftChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GST Rate (%)</label>
                                    <select
                                        name="gstRate"
                                        value={productDraft.gstRate}
                                        onChange={handleDraftChange}
                                    >
                                        {gstRates.map(rate => (
                                            <option key={rate} value={rate}>{rate}%</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Discount Rate (%)</label>
                                    <input
                                        type="number"
                                        name="discountRate"
                                        value={productDraft.discountRate}
                                        onChange={handleDraftChange}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <button type="button" className="add-product-btn" onClick={addProduct}>
                                Add Product to Invoice
                            </button>
                        </div>
                    </div>

                    {/* Products table preview */}
                    {formData.products.length > 0 && (
                        <div className="products-grid-preview">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Particular</th>
                                        <th>Qty</th>
                                        <th>HSN</th>
                                        <th>Rate</th>
                                        <th>CGST 9%</th>
                                        <th>SGST 9%</th>
                                        <th>Basic Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.products.map((p, i) => (
                                        <tr key={`row-${i}`}>
                                            <td>{i + 1}</td>
                                            <td>{p.productName || '-'}</td>
                                            <td>{p.quantity || 0}</td>
                                            <td>{p.hsn || '-'}</td>
                                            <td>₹{Number(p.rate || 0).toFixed(2)}</td>
                                            <td>₹{Number(p.cgst || 0).toFixed(2)}</td>
                                            <td>₹{Number(p.sgst || 0).toFixed(2)}</td>
                                            <td>₹{Number(p.basicAmount || 0).toFixed(2)}</td>
                                            <td>
                                                <button type="button" className="remove-product-btn" onClick={() => removeProduct(i)}>
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="totals-section">
                        <div className="totals-grid">
                            <div className="total-item">
                                <label>Net Amount:</label>
                                <span>₹{calculateTotals().netAmount.toFixed(2)}</span>
                            </div>
                            <div className="total-item">
                                <label>CGST Amount:</label>
                                <span>₹{calculateTotals().totalCgst.toFixed(2)}</span>
                            </div>
                            <div className="total-item">
                                <label>SGST Amount:</label>
                                <span>₹{calculateTotals().totalSgst.toFixed(2)}</span>
                            </div>
                            <div className="total-item total-amount">
                                <label>Total Amount:</label>
                                <span>₹{calculateTotals().totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading || formData.products.length === 0}>
                        {loading ? (isEditMode ? 'Updating Invoice...' : 'Creating Invoice...') : (isEditMode ? 'Update Invoice' : 'Generate Invoice')}
                    </button>
                </form>
            </div>
                )}
        </div>
        </AdminLayout>
    );
};

export default BillGeneration;
